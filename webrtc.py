import webapp2,jinja2,os
from google.appengine.api import channel
from google.appengine.api import memcache
from string import letters
import random
import logging


template_dir=os.path.join(os.path.dirname(__file__),'html')
jinja_env=jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir),
	autoescape=True)


class MainPage(webapp2.RequestHandler):
    def render_str(self,template,**params):
		"""pass parameters to template and render it"""
		t=jinja_env.get_template(template)
		return t.render(params)
		
    def write(self,*a,**kw):
    	self.response.out.write(*a,**kw)

    def render(self,template,**kw):
		self.write(self.render_str(template,**kw))

    def get(self):
        self.response.headers['Content-Type'] = 'text/html'
        self.user_id="".join(random.choice(letters) for i in range(0,4))
        self.token=channel.create_channel(self.user_id)
        tokens=memcache.get('tokens') or []
        tokens.append(self.user_id)
        logging.error("memcache added")
        logging.info("user added to memcache "+self.user_id)
        memcache.set('tokens',tokens)
        self.render('index.html',user_id=self.user_id,token=self.token)

    '''def post(self):
        pass'''

class Message(MainPage):
    def get(self):
        self.response.headers['Content-Type'] = 'text/html'
        self.response.write("got msg")
    def post(self):
        message=self.request.body
        logging.error('msg')
        logging.info(message)
        u=self.request.get("u")
        logging.info("request"+u)
        tokens=memcache.get('tokens')
        logging.info(tokens)
        for token in tokens:
                if(token!=u):
                    logging.info("send message to "+token)
                    channel.send_message(token,message)


application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/message',Message),
], debug=True)
