const LeaderDetailsModal = ({ leader, onClose }) => {
  if (!leader) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Leader Details</h2>
        <div className="space-y-2 text-sm sm:text-base">
          <p><strong>Title:</strong> {leader.title}</p>
          <p><strong>Name:</strong> {leader?.firstname} {leader?.lastname}</p>
          <p><strong>Email:</strong> {leader.email}</p>
          <p><strong>Role:</strong> {leader.role || 'N/A'}</p>
          <p><strong>User Created At:</strong> {leader.userCreatedAt ? new Date(leader.userCreatedAt).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Gender:</strong> {leader.gender}</p>
          <p><strong>Phone:</strong> {leader.phoneNumber}</p>
          <p><strong>Address:</strong> {leader.address}</p>
          <p><strong>State:</strong> {leader.state}</p>
          <p><strong>LGA:</strong> {leader.LGA}</p>
          <p><strong>Religion:</strong> {leader.religion}</p>
          <p><strong>Category:</strong> {leader.category}</p>
          <p><strong>Bio:</strong> {leader.bio || 'N/A'}</p>
          {leader.accountName && (
            <>
              <p><strong>Account Name:</strong> {leader.accountName}</p>
              <p><strong>Account Number:</strong> {leader.accountNumber}</p>
              <p><strong>Bank Name:</strong> {leader.bankName}</p>
            </>
          )}
          <p><strong>Profile Created At:</strong> {new Date(leader.profileCreatedAt).toLocaleDateString()}</p>
          <p><strong>Profile Updated At:</strong> {new Date(leader.profileUpdatedAt).toLocaleDateString()}</p>
          {leader.gallery?.length > 0 && (
            <div>
              <p><strong>Gallery:</strong></p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {leader.gallery.map((image, index) => (
                  <img key={index} src={image} alt={`Gallery ${index + 1}`} className="w-full h-20 object-cover rounded" />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderDetailsModal;