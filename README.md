Hookforward
===========
Hookforward allows you to forward webhooks from an external provider to an app running on your local machine without having to expose ports.

You need a publicly accessible CouchDB server that your webhook provider can post to. On your local machine, you run a simple program that listens for new webhook docs in CouchDB and forwards them on to your app running locally.

I used this setup to develop an app that receives [Stripe](https://stripe.com/) webhooks. Nice to be able to run the app on my local machine and have the whole moustrap work.

This is an alternative to using a service like [Localtunnel](http://progrium.com/localtunnel/). Localtunnel works ok (via voodoo I don't understand), but because they recycle urls frequenly, my app was receiving webhooks from various oddball services that the url was previously used for. Creepy.


Install
-------
```
npm install -g hookforward
```


Per-project setup
-----------------

1. Get a publicly accessible CouchDB server (free plans available from [IrisCouch](http://www.iriscouch.com/) and [Cloudant](https://cloudant.com/))

2. Create a database to store webhooks in, and optionally secure this DB with a username:pass.

3. Run the ```hookforward push``` command with the url for the DB created in step 2, e.g.:
```
hookforward push https://user:pass@myname.cloudant.com/hooks
```
This will push a design doc with an update function which stores HTTP POST requests as documents.

4. Step 3 will output the hook capture url for your DB. Configure your webhook provider to post hooks to this url for development/testing.


Starting the forwarder app
--------------------------

Start the forwarder app on your local machine with the ```hookforward start``` command, specifying the db url and the local url for your app's webhook handler, e.g.:
```
hookforward start https://user:pass@myname.cloudant.com/hooks http://localhost:4567/myhandler
```

You can also specify these urls in a .hookforwardrc file -- see instructions below.


Testing the setup
-----------------

Trigger a test webhook from your webhook provider, or use the ```hookforward test``` command:
```
hookforward test https://user:pass@myname.cloudant.com/hooks
```

Here's a simple one-line Sinatra app you can use to dummy as the app that would consume the webhooks:
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

This will allow you to run ```hookforward start```, ```hookforward push``` and ```hookforward test``` without having to specify urls.


Limitations
-----------
This setup won't work for webhooks that contain binary data -- CouchDB will only accept binary data if it's encoded as Base64.


