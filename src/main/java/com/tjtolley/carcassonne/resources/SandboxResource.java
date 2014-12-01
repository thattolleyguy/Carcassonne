package com.tjtolley.carcassonne.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.tjtolley.carcassonne.game.Game;
import com.tjtolley.carcassonne.game.Position;
import com.tjtolley.carcassonne.game.TileDeck;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;
import org.atmosphere.annotation.Broadcast;
import org.atmosphere.annotation.Suspend;
import org.atmosphere.config.service.AtmosphereService;
import org.atmosphere.jersey.JerseyBroadcaster;

@Path("sandbox")
@Singleton
//@AtmosphereService(broadcaster = JerseyBroadcaster.class)
public class SandboxResource
{
    Game sandboxGame;
    private ObjectMapper mapper;

    @Inject
    public SandboxResource()
    {
        initializeGame();
        mapper = new ObjectMapper();
    }

    private void initializeGame()
    {
        sandboxGame = new Game("sandbox", UUID.randomUUID(), TileDeck.fromFile("BaseTileSet.json"));
    }

    @GET
    public Response getSandbox() throws JsonProcessingException
    {
        return Response.ok(mapper.writeValueAsString(sandboxGame)).build();
    }

//    @GET
//    @Path("update")
//    @Suspend()
//    public String getUpdate()
//    {
//        return "";
//    }

    @POST
    @Path("update")
//    @Broadcast(writeEntity = false)
    public Response update(String payload) throws IOException
    {
        Map<String, Object> readValue = mapper.readValue(payload, Map.class);
        final Position position = new Position((Integer) readValue.get("x"), (Integer) readValue.get("y"));
        final String tileName = (String) readValue.get("tileName");
        if (!sandboxGame.isValid(tileName, position)) {
            return Response.notAcceptable(null).build();
        }
        sandboxGame.placeTile(tileName, position);
        return Response.ok().build();
    }

    @POST
    @Path("placeTile")
    public Response placeTile(String payload) throws IOException
    {
        Map<String, Object> readValue = mapper.readValue(payload, Map.class);
        final Position position = new Position((Integer) readValue.get("x"), (Integer) readValue.get("y"));
        final String tileName = (String) readValue.get("tileName");
        if (!sandboxGame.isValid(tileName, position)) {
            return Response.notAcceptable(null).build();
        }
        sandboxGame.placeTile(tileName, position);
        return Response.ok().build();
    }

    @POST
    @Path("reset")
    public Response resetGame()
    {
        initializeGame();
        return Response.ok().build();
    }

}
