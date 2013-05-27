import urllib2

key = 'tears'
songxml = urllib2.urlopen('http://www.songsterr.com/a/ra/songs.xml?pattern="' + key)
print songxml.read()