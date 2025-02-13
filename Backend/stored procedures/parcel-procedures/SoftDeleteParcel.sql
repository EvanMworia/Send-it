CREATE PROCEDURE SoftDeleteParcel
    @ParcelID UNIQUEIDENTIFIER
AS
BEGIN
   

    -- Check if the parcel exists and is not already deleted
    IF EXISTS (SELECT 1 FROM Parcels WHERE ParcelID = @ParcelID AND IsDeleted = 0)
    BEGIN
        UPDATE Parcels
        SET IsDeleted = 1,
            UpdatedAt = GETDATE()
        WHERE ParcelID = @ParcelID;

        PRINT 'Parcel successfully soft deleted';
    END
    ELSE
    BEGIN
        PRINT 'Parcel not found or already deleted';
    END
END;
