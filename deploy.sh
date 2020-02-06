#!/bin/bash
cp ./now.json ./output/dist
cp ./now.json ./output/dev

name="dojo.widgets"

if [ "$TRAVIS_PULL_REQUEST" != "false" ] ; then
	nowurl=$(npx now ./output/dist --token=$PUBLIC_NOW_TOKEN --public --name=$name --confirm)
	if [ "$nowurl" = "" ] ; then
		echo "Now deployment failed"
		exit 1
	fi

	echo "* Docs Deployment: $nowurl" &>> deployments.txt
	nowurl=$(npx now ./output/dev --token=$PUBLIC_NOW_TOKEN --public --name=$name --confirm)
	if [ "$nowurl" = "" ] ; then
		echo "Now deployment failed"
		exit 1
	fi

	echo "* Tests Deployment: $nowurl" &>> deployments.txt
else
	if [ "$TRAVIS_BRANCH" = "master" ] ; then
		nowurl=$(npx now ./output/dist --token=$NOW_TOKEN --public --name=$name --scope=dojo --target=production --confirm)
		if [ "$nowurl" = "" ] ; then
			echo "Now deployment failed"
			exit 1
		fi

		echo "Deployed to $nowurl"

		if [ "$1" = "" ] ; then
			deploymenturl=$(curl -H "Authorization: Bearer $GITHUB_TOKEN" -H "Content-Type: application/vnd.github.v3+json" -s -X POST https://api.github.com/repos/$TRAVIS_REPO_SLUG/deployments -d '{"ref": "'$TRAVIS_COMMIT'","environment": "production","description": "Deploy request from Travis","auto_merge":false,"required_contexts":[]}' | jq -r '.url')
			if [ "$deploymenturl" = "null" ] ; then
				echo "Failed creating github deployment"
				exit 1
			fi

			echo "Github deployment url $deploymenturl"

			curl -H "Authorization: Bearer $GITHUB_TOKEN" -H "Content-Type: application/vnd.github.v3+json" -s -X POST $deploymenturl/statuses -d '{"environment": "production", "state": "success", "target_url": "'$nowurl'", "log_url": "'$nowurl'/_logs", "environment_url": "'$nowurl'", "description": "Deployment finished successfully."}'
		fi
	fi
fi
