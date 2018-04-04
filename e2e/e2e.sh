#!/bin/bash

trap cleanup EXIT

cleanup() {
    docker-compose stop
}

echo "Starting Docker services..."
docker-compose up -d
if [ $? -ne 0 ] ; then
  echo "Failed to start Docker services"
  exit 1
fi

# Wait until the other services are reachable before running the chorus command
DOCKERIZE="dockerize -wait tcp://chrome:5900 -wait tcp://hub:4444 -wait http://chorus-js-example-app:80 -timeout 90s"

docker-compose exec chorus-interpreter ${DOCKERIZE}
if [ $? -ne 0 ] ; then
  echo "Failed Dockerize checks"
  exit 1
fi


echo "Executing chorus tests..."
for feature in ../features/*.feature
do
	echo "Executing feature: ${feature}..."
	#-T detaches the terminal which has the effect of turning the console highlighting off
	docker-compose exec -T chorus-interpreter chorus -f /features/${feature} | tee ${feature}.actual.txt

	echo "Diffing output..."
	diff ${feature}.expected.txt ${feature}.actual.txt
	DIFF_EXIT_CODE=$?

	if [ ${DIFF_EXIT_CODE} -eq 0 ]; then
		echo "Chorus interpreter output has not changed. ($feature)"
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
