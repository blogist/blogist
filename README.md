[![Build Status](https://travis-ci.org/jcouyang/js-mvc-dojo.png)](https://travis-ci.org/jcouyang/js-mvc-dojo)

## [Setup]()

### install
```sh
npm install
bower install
grunt
python -m SimpleHTTPServer
```
### github token
1. open `https://github.com/settings/applications` and generate token

![](https://www.evernote.com/shard/s23/sh/364f34af-d819-4b4f-bbda-7bc176b90519/ae7b8773aa9089f7a1fcedb3c41df0bd/deep/0/Authorized-applications.png)

2. copy the token
3. open `loaclhost:8000`
4. `CMD`+`ALT`+`I` goto your console
5. localStorage.setItem("access_token",paste); <RETURN>

## Auto Build while developing
`grunt watch`

## Test
`grunt mocha` or open `tests/index.html` in browser

## [Now Begin DOJO](https://github.com/jcouyang/js-mvc-dojo/wiki)
