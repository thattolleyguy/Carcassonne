/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.tjtolley.carcassonne.resources;

import com.google.inject.Inject;
import com.tjtolley.carcassonne.game.GameManager;
import javax.ws.rs.Path;

/**
 *
 * @author tyler
 */
@Path("lobby")
public class LobbyResource
{
	private final GameManager manager;

	@Inject
	public LobbyResource(GameManager manager)
	{
		this.manager = manager;
	}

}
