from model import Grid, Coord
from utility import db
import unittest

class TestGrid(unittest.TestCase):
	def setUp(self):
		db.flushdb()
		status, self.g = Grid.create("test", 16)
	
	def testFromName(self):
		self.assertEqual(Grid.fromName("test"), self.g)
	
	def testExists(self):
		self.assertTrue(self.g.exists())

	def testGet(self):
		c = self.g.get(0,5)
		c['test'] = "Hello world" 
		
		self.assertEqual(c['test'], "Hello world")
	
	def testAround(self):
		# Origin point
		c = self.g.get(5,5)
		c['test'] = "Hello"

		# Create surrounding points
		self.g.get(5,6)['test'] = True # Above
		self.g.get(5,4)['test'] = True # Below
		self.g.get(4,5)['test'] = True # Left
		self.g.get(6,5)['test'] = True # Right

		compare = ["5_6", "5_4", "4_5", "6_5"]
		
		around = self.g.around(c, 6)

		for coord in compare:
			self.assertIn(coord, around)
	
	def tearDown(self):
		db.flushdb()
