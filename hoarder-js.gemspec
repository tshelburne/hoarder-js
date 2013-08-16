# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "hoarder-js"
  s.version = "0.0.2"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.2") if s.respond_to? :required_rubygems_version=
  s.authors = ["Tim Shelburne"]
  s.date = "2013-08-16"
  s.description = ""
  s.email = "shelburt02@gmail.com"
  s.executables = ["hoarder.js"]
  s.extra_rdoc_files = ["CHANGELOG", "LICENSE", "README.rdoc", "bin/hoarder.js", "lib/hoarder.rb", "lib/hoarder/symbols.rb"]
  s.files = ["CHANGELOG", "Gemfile", "Gemfile.lock", "LICENSE", "Manifest", "README.rdoc", "Rakefile", "assets/scripts/coffee/hoarder/form/form.coffee", "assets/scripts/coffee/hoarder/form/form_serializer.coffee", "assets/scripts/coffee/hoarder/form_manager.coffee", "assets/scripts/coffee/hoarder/submitter/form_submitter.coffee", "assets/scripts/coffee/hoarder/submitter/submitters/base_submitter.coffee", "assets/scripts/coffee/hoarder/submitter/submitters/polling_submitter.coffee", "assets/scripts/coffee/hoarder/submitter/submitters/simple_submitter.coffee", "assets/scripts/coffee/hoarder/validator/constraints/alpha_constraint.coffee", "assets/scripts/coffee/hoarder/validator/constraints/alphanumeric_constraint.coffee", "assets/scripts/coffee/hoarder/validator/constraints/base_constraint.coffee", "assets/scripts/coffee/hoarder/validator/constraints/credit_card_constraint.coffee", "assets/scripts/coffee/hoarder/validator/constraints/email_constraint.coffee", "assets/scripts/coffee/hoarder/validator/constraints/max_length_constraint.coffee", "assets/scripts/coffee/hoarder/validator/constraints/min_length_constraint.coffee", "assets/scripts/coffee/hoarder/validator/constraints/numeric_constraint.coffee", "assets/scripts/coffee/hoarder/validator/constraints/phone_constraint.coffee", "assets/scripts/coffee/hoarder/validator/constraints/required_constraint.coffee", "assets/scripts/coffee/hoarder/validator/form_validator.coffee", "assets/scripts/coffee/hoarder/validator/rules/validation_rule.coffee", "assets/scripts/js/lib/bonzo.js", "assets/scripts/js/lib/qwery.js", "assets/scripts/js/lib/reqwest.js", "assets/scripts/js/patches/event_listeners.js", "bin/hoarder.js", "config/assets.rb", "lib/hoarder.rb", "lib/hoarder/symbols.rb", "spec/jasmine.yml", "spec/runner.html", "spec/support/classes.coffee", "spec/support/fixtures.coffee", "spec/support/helpers.coffee", "spec/support/lib/jasmine-fixture.js", "spec/support/lib/jquery-1.7.1.min.js", "spec/support/mocks.coffee", "spec/support/objects.coffee", "spec/support/requirements.coffee", "spec/tests/form/form_serializer_spec.coffee", "spec/tests/form/form_spec.coffee", "spec/tests/form_manager_spec.coffee", "spec/tests/submitter/form_submitter_spec.coffee", "spec/tests/submitter/submitters/polling_submitter_spec.coffee", "spec/tests/submitter/submitters/simple_submitter_spec.coffee", "spec/tests/validator/constraints_spec.coffee", "spec/tests/validator/form_validator_spec.coffee", "spec/tests/validator/validation_rule_spec.coffee", "hoarder-js.gemspec"]
  s.homepage = "https://github.com/tshelburne/hoarder-js"
  s.rdoc_options = ["--line-numbers", "--inline-source", "--title", "Hoarder-js", "--main", "README.rdoc"]
  s.require_paths = ["lib"]
  s.rubyforge_project = "hoarder-js"
  s.rubygems_version = "1.8.24"
  s.summary = ""

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<jasmine>, [">= 0"])
      s.add_development_dependency(%q<jasmine-headless-webkit>, [">= 0"])
    else
      s.add_dependency(%q<jasmine>, [">= 0"])
      s.add_dependency(%q<jasmine-headless-webkit>, [">= 0"])
    end
  else
    s.add_dependency(%q<jasmine>, [">= 0"])
    s.add_dependency(%q<jasmine-headless-webkit>, [">= 0"])
  end
end
