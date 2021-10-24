//package com.ultrasound.app.controller.headers;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.util.MultiValueMap;
//import org.springframework.util.MultiValueMapAdapter;
//import org.springframework.web.reactive.function.client.WebClient;
//import org.springframework.web.server.ServerWebExchange;
//import org.springframework.web.server.WebFilter;
//import org.springframework.web.server.WebFilterChain;
//import reactor.core.publisher.Mono;
//
//import java.util.HashMap;
//import java.util.Map;
//
//public class AddResponseHeaderWebFilter implements WebFilter {
//
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
////        exchange.getRequest().getHeaders().set("Origin", "localhost:8080");
//        Map<String, String> resHeaders = new HashMap<>();
//        resHeaders.put("Access-Control-Allow-Origin", "*");
//        resHeaders.put("Origin", "http://localhost:3000");
//        MultiValueMapAdapter<String, String> resHeadersMulti = new MultiValueMapAdapter(resHeaders);
//        exchange.getRequest().getHeaders().addAll(resHeadersMulti);
//
//        exchange.getResponse()
//                .getHeaders().addAll(resHeadersMulti);
//        return chain.filter(exchange);
//    }
//}
