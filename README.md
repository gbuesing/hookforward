Hookforward
===========
Hookforward allows you to forward webhooks from an external provider to an app running on your local machine without having to expose ports.

You need a publicly accessible CouchDB server that your webhook provider can post to. On your local machine, you run a simple program that listens for new webhook docs in CouchDB and forwards them to the url of your dev server.

I used this setup to develop an app that receives [Stripe](https://stripe.com/) webhooks. Nice to be able to run the app on my local machine and have the whole moustrap work.

This is an alternative to using a service like [Localtunnel](http://progrium.com/localtunnel/). Localtunnel works ok (via voodoo I don't understand), but because they recycle urls frequenly, my app was receiving webhooks from various oddball services that the url was previously used for. Creepy.


One-time setup
--------------

1. Get a publicly accessible CouchDB server (free plans available from [IrisCouch](http://www.iriscouch.com/) and [Cloudant](https://cloudant.com/))

2. Run the ```hookforward push``` command with your desired DB url, e.g.:
```
hookforward push https://user:pass@myname.cloudant.com/hooks
```
This will create the DB if it doesn't already exist, and push a design doc with a hook capture update function.

3. Set 2 will output the hook capture url for your DB. Configure your webhook provider to post hooks to this url for development/testing.


Usage
-----

Start the forwarder server on your dev machine with the ```hookforward start``` command, specifying the db url and the url you'd like to forward your webhook to, e.g.:
```
hookforward start https://user:pass@myname.cloudant.com/hooks http://localhost:4567/myhandler
```


Testing the setup
-----------------

Trigger a test webhook from your webhook provider, or use the ```hookforward test``` command, e.g.:
```
hookforward test https://user:pass@myname.cloudant.com/hooks
```

Here's a simple one-line Sinatra app to test receiving webhooks, which will just dump the contents to STDOUT:
```
ruby -rubygems -r sinatra -e "post('*') { puts request.body.read }"
```


hookforwardrc
-------------
You can create a .hookforwardrc file with your DB and handler urls:

```
{
  "db_url": "https://user:pass@myname.cloudant.com/hooks",
  "handler_url": "http://localhost:4567/myhandler"
}
```

This will allow you to run hookforward commands without having to specify urls, e.g. you can just run ```hookforward start```


Caveats
-------
This setup won't work for webhooks that contain binary data -- CouchDB will only accept binary data if it's encoded as Base64.


