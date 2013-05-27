import web
import urllib2

render = web.template.render('templates/')
#http:///www.songsterr.com/a/ra/songs.xml?pattern=" + key

urls = (
    '/', 'index'
    ,'/dat', 'dat'
    ,'/bysong', 'bysong'
    ,'/byartist', 'byartist'
    ,'/bysongid', 'bysongid'
)

class index:
    def GET(self):
        return render.index()

class dat:
    def GET(self):
        i = web.input(domain=None,key=None)
        songxml = urllib2.urlopen('http://'+i.domain+'.cloudfront.net/' + i.key, timeout=60)
        print songxml
        return songxml.read()

class bysong:
    def GET(self):
        i = web.input(key=None)
        songxml = urllib2.urlopen('http://www.songsterr.com/a/ra/songs.xml?pattern="' + i.key, timeout=60)
        return songxml.read()
    
class byartist:
    def GET(self):
        i = web.input(key=None)
        songxml = urllib2.urlopen('http://www.songsterr.com/a/ra/songs/byartists.xml?artists="' + i.key + '"', timeout=60)
        return songxml.read()
    
class bysongid:
    def GET(self):
        web.header('Content-Type', 'text/xml')
        i = web.input(key=None)
        songxml = urllib2.urlopen("http://www.songsterr.com/a/ra/player/song/" + i.key + ".xml", timeout=60)
        return songxml.read()

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()