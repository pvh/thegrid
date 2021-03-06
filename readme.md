thegrid
=========
Thegrid is a multiplayer RTS game. Your goal is to defeat any other colonies on your grid by placing special tiles and collecting resources.

![Thegrid in action](http://i.imgur.com/OXE1m.png)

I'm kind of randomly deciding to release this right now, so there will definitely be more information to come...

## Features
    * Realtime multiplayer gameplay
    * Customizable maps
    * Defeat others using infectors or destroyers
    * A developer who loves working on this, so feel free to suggest additions

## Running a server
I've yet to deploy this to an actual production environment so I can't help there, but if you're looking to start a development server to play around with I made it pretty easy.

Firstly, get [vagrant](http://vagrantup.com/):

    gem install vagrant

Next, clone the repo, cd in, and start the virtual machine:

    git clone https://stevenleeg@github.com/stevenleeg/thegrid.git
    cd thegrid
    vagrant up

I'm assuming you don't have the custom vagrant box that I created, so after this you may have to sit back for a bit while it downloads a copy from the internet. 

**Unrelated stuff:** If you're interested, the box is a pretty vanilla arch32 installation that I made. It might be pretty useful for your own projects. Feel free to play around with it if you'd like.

Now that the VM is up and running, let's start the grid server:

    vagrant ssh
    -- wait for the VM's prompt to pop up --
    cd /vagrant
    sudo rc.d start redis
    python thegrid.py

And there you go! Navigate to `http://localhost:8080` and you'll have a perfectly functional copy of thegrid waiting for you to play and hack on!

## About the project
I've always been interested in a new technologies and I originally created this project for a fun way to mess around with [http://tornadoweb.org](tornado) and websockets. After showing this to a few friends, all of them seemed to like the concepts of the game so I continued to develop it. I currently don't have the money to turn this into anything big, so I figured it'd be best to share my learning with the world and invite anyone who's interested to learn with me and help develop. 

If you know some python, javascript, HTML, css, or have any sort of design expertise please feel free to join in by forking the repo. I'd love to have others work on this project with me. If not, you can help just as much by playing and enjoying the game and spreading the word!
