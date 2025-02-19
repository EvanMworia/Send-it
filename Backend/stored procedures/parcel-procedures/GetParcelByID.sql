CREATE PROCEDURE sp_GetParcelByID
    @ParcelID UNIQUEIDENTIFIER
AS
BEGIN
      SET NOCOUNT ON;

    -- Check if the parcel exists and is not soft deleted
    IF EXISTS (SELECT 1 FROM Parcels WHERE ParcelID = @ParcelID AND IsDeleted = 0)
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
        WHERE p.ParcelID = @ParcelID AND p.IsDeleted = 0;
    END
    ELSE
    BEGIN
        PRINT 'Parcel not found or has been deleted';
    END
END;
