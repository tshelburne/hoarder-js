assets_are_in "#{::Hoarder.root_path}/assets"

asset 'hoarder.min.js' do |a|
	a.scan 'scripts/coffee', 'scripts/js'
	a.add_assets_from ::Cronus.keystone_compiler
	a.toolchain :coffeescript, :require
	a.post_build :closure
end
