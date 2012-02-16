from tornado.websocket import WebSocketHandler
from model import Game
from utility import clients, games
import async
import json
from uuid import uuid4

class Client(WebSocketHandler):
	def open(self):
		self.gid = None
		self.uid = None
		pass

	def send(self, data):
		self.write_message(json.dumps(data))

	def on_message(self, message):
		try:
			message = json.loads(message)
		except:
			pass

		# Load the function
		ret = getattr(async, message['f'])(self, **message)
		ret['cid'] = message['cid']
		self.send(ret)
	
	def joinGame(self, gid, color):
		# Generate a unique id
		self.uid = str(uuid4())[0:5]
		# Make sure it doesn't exist already
		while self.uid in clients:
			self.uid = str(uuid4())[0:5]

		# Add the client to a game
		if gid not in games:
			games[gid] = []

		games[gid].append(self.uid)

		# Add the client to the clients dict
		clients[self.uid] = {
			"cb": self,
			"game": gid,
			"color": color
		}

		return self.uid
	
	def on_close(self):
		if self.uid in clients:
			del(clients[self.uid])
		if self.gid in games:
			if self.uid in games[self.gid]:
				games[self.gid].remove(self.uid)
