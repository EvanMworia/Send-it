USE SENDITDB
GO
GO
CREATE or ALTER PROCEDURE GetAllParcels
    @SenderEmail VARCHAR(255) = NULL,  -- Optional filter
    @ReceiverEmail VARCHAR(255) = NULL,  -- Optional filter
    @Status VARCHAR(50) = NULL  -- Optional filter
AS
BEGIN
    

    SELECT 
        ParcelID, SenderEmail, ReceiverEmail, SendingLocation, PickupLocation, 
        Status, CreatedAt, UpdatedAt
    FROM Parcels
    WHERE IsDeleted = 0  -- Exclude soft deleted parcels
        AND (@SenderEmail IS NULL OR SenderEmail = @SenderEmail)
        AND (@ReceiverEmail IS NULL OR ReceiverEmail = @ReceiverEmail)
        AND (@Status IS NULL OR Status = @Status)
    ORDER BY CreatedAt DESC;  -- Show newest first
END;



