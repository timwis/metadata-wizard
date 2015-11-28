var Vue = require('vue')
var request = require('then-request')
var template = require('./template.html')
var deslugify = require('./filters/deslugify')

var HOSTNAME = 'http://10.0.1.11:5000'

var app = new Vue({
	el: '#main',
	template: template,
	data: function() {
		return {
			featureClasses: [],
			featureClass: {},
			metadata: {}
		}
	},
	methods: {
		featureClassChange: function(e) {
			this.featureClass = {}
			this.metadata = {}
			
			var context = this
			request('GET', HOSTNAME + '/feature-classes/' + e.currentTarget.value).done(function(res) {
				context.featureClass = JSON.parse(res.body)
				context.featureClass.name = deslugify(context.featureClass.name)
			})
			request('GET', HOSTNAME + '/feature-classes/' + e.currentTarget.value + '/metadata').done(function(res) {
				context.metadata = JSON.parse(res.body)
			})
		}
	}
})

request('GET', './test/data/feature-classes').done(function(res) {
	app.featureClasses = JSON.parse(res.body).feature_classes.sort()
})