#!/bin/bash

trap cleanup EXIT

cleanup() {
    docker-compose stop
}

echo "
  Starting Docker services using docker-compose...
  We are starting containers based on the following images:

  1. chorusbdd/chorus-interpreter, to run the chorus interpreter
  2. selenium/hub and selenium/node-chrome-debug, so that chorus can open a browser
  3. node, to build and serve the back end for the app under test

"

docker-compose up -d
if [ $? -ne 0 ] ; then
  echo "Failed to start Docker services"
  exit 1
fi

echo "Started docker compose - now testing all the containers are reachable.."
echo "This may take a little time..."
DOCKERIZE="dockerize -wait tcp://chrome:5900 -wait tcp://hub:4444 -wait http://chorus-js-example-app:80 -timeout 90s"
docker-compose exec chorus-interpreter ${DOCKERIZE}
if [ $? -ne 0 ] ; then
  echo "Failed Dockerize checks, not all the containers were responsive - exiting"
  exit 1
fi
echo "Everything looks good..."

echo "Executing chorus tests..."
cd features
for feature in *.feature
do
	echo "Executing feature: ${feature}..."

	# exec -T detaches the terminal which has the effect of turning Chorus' console highlighting off
	# Since we capturing and comparing the std output we need this param, or the console colour highlighting and animation will fail the tests
	docker-compose exec -T chorus-interpreter chorus -f /features/${feature} | tee ${feature}.actual.txt

	echo "Diffing output..."
	diff ${feature}.expected.txt ${feature}.actual.txt
	DIFF_EXIT_CODE=$?

	if [ ${DIFF_EXIT_CODE} -eq 0 ]; then
		echo "PASSED - Chorus interpreter output has not changed. ($feature)"
		echo ""
	else
	    echo "Actual Chorus interpreter output was different from expected! ($feature)"
	    echo "Actual ------------------->"
	    cat ${feature}.actual.txt
		echo "---------------------------"
		echo ""
	    echo "Expected ------------------>"
	    cat ${feature}.expected.txt
	    echo "----------------------------"
	    exit 1
    fi

	rm $feature.actual.txt

done
