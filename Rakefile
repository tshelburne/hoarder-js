$: << File.expand_path("#{File.dirname(__FILE__)}/lib")

require 'hoarder'
require 'cronus'

require 'rake'
require 'jasmine-headless-webkit'
require 'keystone'
require 'echoe'

Echoe.new("hoarder-js") do |p|
  p.author = "Tim Shelburne"
  p.email = "shelburt02@gmail.com"
  p.url = "https://github.com/tshelburne/hoarder-js"

  p.ignore_pattern = FileList[".gitignore"]
  p.development_dependencies = [ "jasmine", "jasmine-headless-webkit" ]
end

desc "Default"
task default: :'test:jasmine'

namespace :test do

	desc "Run Jasmine tests"
	Jasmine::Headless::Task.new(jasmine: :assets) do |t|
	  t.colors = true
	  t.keep_on_error = true
	  t.jasmine_config = './spec/jasmine.yml'
	end
	
end

desc "Build assets"
Keystone::RakeTask.new :assets do |t|
  t.config_file = "config/assets.rb"
  t.output_path = 'bin'
end

desc "Build binaries"
task :binaries do |t|
	Rake::Task[:assets].invoke
	`gzip -c bin/hoarder.js > bin/hoarder.js.gz`
end