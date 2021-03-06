package com.tjtolley.carcassonne;

import com.google.inject.AbstractModule;
import com.hubspot.dropwizard.guice.GuiceBundle;
import com.tjtolley.carcassonne.game.GameManager;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.assets.AssetsBundle;

public class BaseApplication extends Application<WebConfig>
{

	public static void main(String[] args) throws Exception
	{
		new BaseApplication().run(args);
	}

	@Override
	public String getName()
	{
		return "Carcassonne";
	}

	@Override
	public void initialize(Bootstrap<WebConfig> bootstrap)
	{
		GuiceBundle<WebConfig> guiceBundle = GuiceBundle.<WebConfig>newBuilder()
				.addModule(new GuiceModule())
				.setConfigClass(WebConfig.class)
				.build();
		bootstrap.addBundle(guiceBundle);
		bootstrap.addBundle(new AssetsBundle("/assets","/Carcassonne"));
	}

	@Override
	public void run(WebConfig configuration,
					Environment environment)
	{
		final TemplateHealthCheck healthCheck = new TemplateHealthCheck(configuration.getTemplate());
		environment.healthChecks().register("template", healthCheck);
		environment.jersey().packages("com.tjtolley.carcassonne.resources");
	}

	private static class GuiceModule extends AbstractModule
	{

		@Override
		protected void configure()
		{
			bind(GameManager.class).asEagerSingleton();
		}

	}
}
