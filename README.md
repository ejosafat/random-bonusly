# random-bonusly
Random bonus generator to be used with bonus.ly

## General information
If your company uses [bonus.ly](https://bonus.ly/), you might end up noticing that you always give bonuses just to the people around you as you don't have any clue about other team's achievements, so to be fair and give away rewards to those in the far corner of the office, you can generate them randomly.
This is a command line utility, once installed, just type
```
$ random-bonusly
```
and you'll create a +1 bonus to a random person, with a random quote from Star Trek (default) and the hashtag #why-so-serious.
## Getting started
This application is dependent on Node 6.x and an old application known as fortune(s). To install node you can use
```
$ brew install node
```
if you are running Mac OS X and use [Homebrew](http://brew.sh) as a package manager (recommended). If not, you can download an install from [nodejs.org](https://nodejs.org).

If you are using Linux, there are several ways of installing it. In an Ubuntu distro, 
```
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

To install fortune in Mac OS X with [Homebrew](http://brew.sh), do
```
$ brew install fortune
```
In a linux deb based distro,
```
$ sudo apt-get fortunes
```

After installing those, clone this repo into a local folder. You need to create a file in the same folder named *secrets.json*, with this format:
```
{
    "access_token": "youraccesstokenhere"
}
```
Rename the file secrets.sample.json to secrets.json and edit it to change "youraccesstokenhere" to your bonus.ly access_token, that, after logging in, you can get from [here](https://bonus.ly/api).

Then from within the cloned folder, run
```
$ npm install -g . 
```
You might have to run that as sudo if you are using Linux, depending on your distro.
Now you are set to go! Just type 
```
$ random-bonusly
```
and you'll see the bonus given and how many points left you have to reward others.

### Command line options
* -#: hashtag to be used. Add an space between the flag and the hashtag.
* --dry-run: generate a bonus and log it without posting.
* -m: message to be used, between quotes.
* -p: number of points to be given.

### Using different fortune sets
After the last command line option, just add whatever sets you want, separated by spaces, for example:
```
$ random-bonusly --dry-run science pets
```
To see available sets of quotes, 
```
$ fortune -f
```

