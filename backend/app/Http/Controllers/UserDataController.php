<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class UserDataController extends Controller
{
    public function login(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'password' => 'required|string',
            ]);

            if (!Auth::attempt($request->only('name', 'password'))) {
                return response()->json(['message' => 'Identifiants invalides'], 401);
            }

            $user = Auth::user();
            
            if (!method_exists($user, 'createToken')) {
                Log::error('Missing HasApiTokens trait in User model');
                return response()->json(['message' => 'Erreur de configuration du serveur'], 500);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $user = Auth::user();

            return response()->json([
                'message' => 'Connexion réussie',
                'access_token' => $token,
                'user' => $user,
                'token_type' => 'Bearer',
            ]);
            
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur du serveur'], 500);
        }
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:users,name',
                'password' => 'required|string|min:6',
            ]);

            $user = User::create([
                'name' => $request->name,
                'password' => Hash::make($request->password),
            ]);

            Auth::login($user);
            
            if (!method_exists($user, 'createToken')) {
                Log::error('Missing HasApiTokens trait in User model');
                return response()->json(['message' => 'Erreur de configuration du serveur'], 500);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Inscription et connexion réussies',
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur du serveur'], 500);
        }
    }
}
