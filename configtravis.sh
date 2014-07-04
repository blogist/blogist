token=$(git config github.oauth-token)
if [ -z $token ]
then
		echo "geting the token from github"
		token=$(curl -u 'jcouyang' -d '{"scopes":["gist"], "note":"blogist"}' https://api.github.com/authorizations | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["token"]')
fi
gem install travis
travis encrypt GH_TOKEN=$token --add
echo "now open https://travis-ci.org/profile and toggle on the repo"
