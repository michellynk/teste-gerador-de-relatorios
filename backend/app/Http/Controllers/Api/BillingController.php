<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BillingRequest;
use App\Models\Billing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Eager load do cliente usando os índices que criamos
        $query = Billing::with('customer:id,name,document,email');

        if ($customerId = $request->input('customer_id')) {
            $query->where('customer_id', $customerId);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('name', 'like', "%{$search}%")
                                    ->orWhere('document', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = (int) $request->input('per_page', 10);
        $billings = $query->latest('id')->paginate($perPage);

        return response()->json($billings);
    }

    public function store(BillingRequest $request): JsonResponse
    {
        $billing = Billing::create($request->validated());
        $billing->load('customer:id,name,document,email');

        return response()->json([
            'message' => 'Cobrança cadastrada com sucesso.',
            'data' => $billing,
        ], 201);
    }

    public function show(Billing $billing): JsonResponse
    {
        $billing->load('customer:id,name,document,email');

        return response()->json([
            'data' => $billing,
        ]);
    }

    public function update(BillingRequest $request, Billing $billing): JsonResponse
    {
        $billing->update($request->validated());
        $billing->load('customer:id,name,document,email');

        return response()->json([
            'message' => 'Cobrança atualizada com sucesso.',
            'data' => $billing,
        ]);
    }

    public function destroy(Billing $billing): JsonResponse
    {
        $billing->delete();

        return response()->json([
            'message' => 'Cobrança removida com sucesso.',
        ]);
    }
}