if [ "$TRAVIS_PULL_REQUEST" != "false" ] ; then
	deployments="This pull request has been deployed to:\n$(sed -E ':a;N;$!ba;s/\r{0,1}\n/\\n/g' deployments.txt)"
	echo '{"body": "'$deployments'"}' >> deployments.json
	curl -H "Authorization: token ${PUBLIC_GITHUB_TOKEN}" -H "Content-Type: application/vnd.github.v3+json" -s -X POST "https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments" --data-binary "$(<deployments.json)"
fi
