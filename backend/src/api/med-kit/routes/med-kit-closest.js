module.exports = {
	routes: [
	  {
		method: 'GET',
		path: '/med-kit/closest',
		handler: 'med-kit.findClosest'
	  }
	]
  };