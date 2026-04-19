function showSuccessPopup() {
   const modal = document.getElementById('successModal');
   modal.style.display = 'flex';
}

function closeModal() {
   const modal = document.getElementById('successModal');
   modal.style.display = 'none';
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
   const modal = document.getElementById('successModal');
   if (event.target == modal) {
      modal.style.display = 'none';
   }
}
