package com.tjtolley.carcassonne.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

//@Path("sandbox")?
public class SandboxResource
{
    @GET
    public Response getSandbox()
    {
        return Response.ok().build();
    }
}
