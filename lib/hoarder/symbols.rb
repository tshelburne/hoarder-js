require "keystone"

module LIBRARY_NAME_UCASE
	
	@@pipeline ||= ::Keystone.bootstrap("#{File.dirname(__FILE__)}/../../config/assets.rb")
	
	def self.keystone_compiler
		@@keystone_compiler ||= @@pipeline.compiler("hoarder.js")
	end

end
