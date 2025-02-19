CREATE or ALTER PROCEDURE GetAllParcels
    @SenderID UNIQUEIDENTIFIER = NULL,  -- Optional filter
    @ReceiverID UNIQUEIDENTIFIER = NULL,  -- Optional filter
    @Status NVARCHAR(50) = NULL  -- Optional filter
AS
BEGIN
    

    SELECT 
        p.ParcelID, 
        p.SenderID, 
        s.FullName AS SenderName, 
		s.Email AS SenderEmail,
        p.ReceiverID, 
        r.FullName AS ReceiverName, 
		r.Email AS ReceiverEmail,
        p.SendingLocation, 
        p.PickupLocation, 
        p.Status, 
        p.CreatedAt, 
        p.UpdatedAt
    FROM Parcels p
    INNER JOIN Users s ON p.SenderID = s.UserID
    INNER JOIN Users r ON p.ReceiverID = r.UserID
    WHERE p.IsDeleted = 0  -- Exclude soft deleted parcels
        AND (@SenderID IS NULL OR p.SenderID = @SenderID)
        AND (@ReceiverID IS NULL OR p.ReceiverID = @ReceiverID)
        AND (@Status IS NULL OR p.Status = @Status)
    ORDER BY p.CreatedAt DESC;  -- Show newest first
END;
