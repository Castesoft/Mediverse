using System;

namespace MainService.Models.Entities
{
    public class WarehouseProduct
    {
        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        // Total quantity in stock.
        public int Quantity { get; set; }

        // Quantity allocated for pending orders or reservations.
        public int ReservedQuantity { get; set; }

        // Optionally, track damaged or on-hold items.
        public int DamagedQuantity { get; set; }
        public int OnHoldQuantity { get; set; }

        // Computed sellable quantity.
        public int SellableQuantity => Quantity - ReservedQuantity - DamagedQuantity - OnHoldQuantity;

        // Indicates if there is any sellable stock available.
        public bool IsAvailable => SellableQuantity > 0;

        // Threshold for triggering a reorder.
        public int ReorderLevel { get; set; }

        // Safety stock level to keep in reserve.
        public int SafetyStock { get; set; }

        // Timestamp for the last stock update.
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // Optional: if you need to track batch-specific info.
        public string? LotNumber { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}