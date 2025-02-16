USE SENDITDB
GO
CREATE OR ALTER PROCEDURE sp_GetParcelByID
    @ParcelID VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the parcel exists and is not soft deleted
    IF EXISTS (SELECT 1 FROM Parcels WHERE ParcelID = @ParcelID AND IsDeleted = 0)
    BEGIN
        SELECT 
            ParcelID, SenderEmail, ReceiverEmail, SendingLocation, PickupLocation, 
            Status, CreatedAt, UpdatedAt
        FROM Parcels
        WHERE ParcelID = @ParcelID AND IsDeleted = 0;
    END
    ELSE
    BEGIN
        PRINT 'Parcel not found or has been deleted';
    END
END;
