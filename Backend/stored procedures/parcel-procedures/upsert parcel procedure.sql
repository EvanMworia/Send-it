CREATE OR ALTER PROCEDURE UpsertParcel
    @ParcelID UNIQUEIDENTIFIER = NULL,  -- NULL when creating a new parcel
    @SenderID UNIQUEIDENTIFIER,
    @ReceiverID UNIQUEIDENTIFIER,
    @SendingLocation NVARCHAR(255) = NULL,
    @PickupLocation NVARCHAR(255) = NULL,
    @Status NVARCHAR(50) = 'Pending'  -- Default status
AS
BEGIN
    SET NOCOUNT ON;

    -- If ParcelID is NULL, insert a new parcel
    IF @ParcelID IS NULL
    BEGIN
        DECLARE @NewParcelID UNIQUEIDENTIFIER = NEWID();

        INSERT INTO Parcels (ParcelID, SenderID, ReceiverID, SendingLocation, PickupLocation, Status, CreatedAt, UpdatedAt)
        VALUES (@NewParcelID, @SenderID, @ReceiverID, @SendingLocation, @PickupLocation, @Status, GETDATE(), GETDATE());

        PRINT ('New parcel created');
    END
    ELSE
    BEGIN
        -- Update status of an existing parcel
        UPDATE Parcels
        SET Status = @Status,
            UpdatedAt = GETDATE()
        WHERE ParcelID = @ParcelID;

        PRINT ('Parcel status updated for ID');
    END
END;
