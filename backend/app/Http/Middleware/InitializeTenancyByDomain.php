<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Resolvers\DomainTenantResolver;

class InitializeTenancyByDomain {
    public function handle(Request $request, Closure $next) {
        $host = $request->getHost();
        $domain = Domain::where('domain', $host)->first();
        if ($domain) {
            DomainTenantResolver::$currentDomain = $domain;
        }
        return $next($request);
    }
}