assets_are_in File.expand_path("#{File.dirname(__FILE__)}/assets")

asset 'hoarder.js' do |a|
	a.scan 'scripts/coffee'
	a.toolchain :coffeescript, :require
	a.post_build :closure
end
