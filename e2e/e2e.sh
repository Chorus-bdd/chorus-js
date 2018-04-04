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
#docker-compose exec -T chorus-interpreter ${DOCKERIZE} chorus -c -f /features


echo "Executing chorus tests..."
for feature in ../features/*.feature
do
	echo "Executing feature: ${feature}..."
	docker-compose exec -T chorus-interpreter ${DOCKERIZE} chorus -f /features/${feature} | tee ${feature}.actual.txt

	# We have to pick up the exit code using docker inspect
    LAST_CONTAINER_ID=`docker ps -l -q`
    EXIT_CODE=`docker inspect ${LAST_CONTAINER_ID} --format='{{.State.ExitCode}}'`

    if [ "${EXIT_CODE}" -ne 0 ] ; then
	  echo "Exit code from Chorus interpreter was $?"
	  echo "Service logs:"
	  docker-compose logs
	  echo "Tests Failed"
	  exit 1
	fi

#	LINE_COUNT=`wc -l ${feature}.expected.txt | awk '{ print $1 }'`

#	tail -${LINE_COUNT}l ${feature}.actual.txt > ${feature}.actual.tail.txt

	echo "Diffing output..."
	diff ${feature}.expected.txt ${feature}.actual.txt
	DIFF_EXIT_CODE=$?

	if [ ${DIFF_EXIT_CODE} -eq 0 ]; then
		echo "Chorus interpreter output has not changed. ($feature)"
	else
	    echo "Actual Chorus interpreter output was different from expected! ($feature)"
	    exit 1
    fi

	rm $feature.actual.txt

done
