token= git config github.oauth-token
if [-n $token]
then
		echo "geting the token from github"
		token=curl -u '{{username}}' -d '{"scopes":["gist"], "note":"blogist"}' https://api.github.com/authorizations | grep -Pom 1 '"access_token": "\K[^"]*'
fi
gem install travis
travis encrypt GH_TOKEN=$token --add
echo "now open https://travis-ci.org/profile and toggle on the repo"
