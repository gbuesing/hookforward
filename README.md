Hookforward
===========
Hookforward allows you to forward webhooks (a.k.a. "server notifications" or "postbacks") from an external provider to an app running on your local machine without having to expose ports.

You need a publicly accessible CouchDB server that your webhook provider can post to. On your local machine, you run a simple program that listens for new webhook docs in CouchDB and forwards them on to your app running locally.

I've used this setup to develop apps that receive [Stripe](https://stripe.com/) and [Transloadit](https://transloadit.com/) webhooks. Nice to be able to run an app on my local machine and have the whole moustrap work.

This is an alternative to using a service like [Localtunnel](http://progrium.com/localtunnel/). Localtunnel works ok (via voodoo I don't understand), but because they recycle urls frequenly, my app was receiving webhooks from various oddball services that the url was previously used for. Creepy.


Install
-------
```
npm install -g hookforward
```


Per-project setup
-----------------

1. Get a publicly accessible CouchDB server (free plans available from [Cloudant](https://cloudant.com/) and [IrisCouch](http://www.iriscouch.com/))

2. Create a database to store webhooks in, and optionally secure this DB with a username:pass.

3. Run the ```hookforward push``` command with the url for the DB created in step 2, e.g.:
```
hookforward push https://user:pass@myname.cloudant.com/hooks
```
This will push a design doc with an update function which stores HTTP POST requests as documents.

4. Step 3 will output the hook capture url for your DB, which will look something like this:
```
https://user:pass@myname.cloudant.com/hooks/_design/hookforward/_update/capture
```
You'll need to configure your setup to post webhooks to this url. Depending upon the service, you'll either need to specify this in an admin management console (e.g. Stripe), or in a param with every API call (e.g. Transloadit's "notify_url" param.)


Starting the forwarder app
--------------------------

Start the forwarder app on your local machine with the ```hookforward start``` command, specifying the db url and the local url for your app's webhook handler, e.g.:
```
hookforward start https://user:pass@myname.cloudant.com/hooks http://localhost:4567/myhandler
```

For convenience, you can specify these urls in a .hookforwardrc file, and then you can just run ```hookforward start``` without any urls on the command line -- see instructions below.


Testing the setup
-----------------
With the DB setup and the forwarder app started, the mousetrap is ready.

Most services will have an easy way to push out a test webhook to your app. If you can't do that, you can use the ```hookforward test``` command:
```
hookforward test https://user:pass@myname.cloudant.com/hooks
```
...which will push a very basic hook to your Couch DB capture url.

The forwarder app is listening for new documents in the DB via Couch DB's changes feed. So once the hook is captured in your DB, the forwarder app will receive the new webhook document, and then post that back to your local app.

If all is set up correctly, you should see a record of this webhook being received in your app's log.


Specifying different app endpoints per request
----------------------------------------------
If you're using a service where you pass in the notify_url per request (like Transloadit), you can also specify your local app endpoint per request, by appending a notify_url param.

For example, here's a url that will allow the provider to post to your CouchDB, with a notify_url param that the forwarder app will use (instead of a url specifcied on command line or in .hookforwardrc):
```
https://user:pass@myname.cloudant.com/hooks/_design/hookforward/_update/capture?notify_url=http%3A%2F%2Flocalhost%3A4567%2Fmyhandler/someid
```


.hookforwardrc
--------------
You can create a .hookforwardrc file in the root of your project with your DB and notify urls:

```
{
  "db_url": "https://user:pass@myname.cloudant.com/hooks",
  "notify_url": "http://localhost:4567/myhandler"
}
```

This will allow you to run ```hookforward start```, ```hookforward push``` and ```hookforward test``` without having to specify urls.


Limitations
-----------
This setup won't work for webhooks that contain binary data -- CouchDB will only accept binary data if it's encoded as Base64.


