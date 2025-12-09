var contactModal = document.querySelector("#contactModal");
var modalBackdrop = document.querySelector("#modalBackdrop");
var openBtn = document.querySelector("#addBtn");
var closeBtn = document.querySelector("#closeBtn");
var cancelBtn = document.querySelector("#cancelBtn");
var contactForm = document.querySelector("#contactForm");
var contactsGrid = document.querySelector("#contacts-grid");
var saveBtn = document.querySelector("#saveBtn");
var searchInput = document.querySelector("#searchInput");
var imagePreview = document.querySelector("#imagePreview");

var contactName = document.querySelector("#contactName");
var contactPhone = document.querySelector("#contactPhone");
var contactEmail = document.querySelector("#contactEmail");
var contactAddress = document.querySelector("#contactAddress");
var contactGroup = document.querySelector("#contactGroup");
var contactNotes = document.querySelector("#contactNotes");
var contactFavorite = document.querySelector("#contactFavorite");
var contactEmergency = document.querySelector("#contactEmergency");
var contactImage = document.querySelector("#contactImage");
var nameError = document.querySelector("#contactNameError");
var phoneError = document.querySelector("#contactPhoneError");
var emailError = document.querySelector("#contactEmailError");
var mode ;

var nameRegex = /^[A-Za-z][A-Za-z\s]{1,}$/;
var phoneRegex = /^(?:\+20|20|0020|0)(10|11|12|15)\d{8}$/;
var emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

var gradientClasses = [
  "gradient-color-0",
  "gradient-color-1",
  "gradient-color-2",
  "gradient-color-3",
  "gradient-color-4",
  "gradient-color-5",
  "gradient-color-6",
  "gradient-color-7",
];

var currentIndex;
var contactsList = [];
if (localStorage.getItem("contactsList")) {
  contactsList = JSON.parse(localStorage.getItem("contactsList"));
  displayContacts();
}

openBtn.addEventListener("click", function(){
  clearGradientClasses(imagePreview);
  imagePreview.style.backgroundImage="";
  imagePreview.classList.add("default-bg");
  imagePreview.innerHTML=`<i class="fa-solid fa-user fs-2"></i>`
  mode = 'add';
  contactForm.reset();
  openModal();
});
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
contactName.addEventListener("input", validateName);
contactPhone.addEventListener("input", validatePhone);
contactEmail.addEventListener("input", validateEmail);
saveBtn.addEventListener("click",function(){
  saveContact(mode);
});
searchInput.addEventListener("input",displayContacts);
contactsGrid.addEventListener("click", function(e){
  var editBtn = e.target.closest(".edit-btn");
  if (editBtn) {
    currentIndex = parseInt(editBtn.dataset.index);
    console.log(currentIndex);
    setUpFields(currentIndex);
    return;
  }

  var deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn) {
    currentIndex = parseInt(deleteBtn.dataset.index);
    console.log(currentIndex);
    deleteContact(currentIndex);
    return;
  }
});

function checkContacts() {
  var html = "";
  if (contactsList.length < 1) {
    html += `
    <div class="w-100 text-center py-5">
                <div class="mb-4 bg-secondary-subtle mx-auto p-3 rounded-4 fit-content">
                    <i class="fa-solid fa-address-book fs-1 text-secondary"></i>
                </div>
                <p class="text-muted m-0">No contacts found</p>
                <p class="text-secondary">Click "Add Contact" to get started</p>
            </div>
    `;
    contactsGrid.innerHTML = html;
    document.querySelector("#totalValue").textContent = contactsList.length;
    displayFavorites();
    displayEmergency();
  } else {
    displayContacts();
  }
}
checkContacts();

function displayContacts() {
  displayFavorites();
  displayEmergency();
  document.querySelector("#contactsNumber").textContent = contactsList.length;
  document.querySelector("#totalValue").textContent = contactsList.length;
  var html = ``;
  for (var i = 0; i < contactsList.length; i++) {
    if (
      contactsList[i].name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      contactsList[i].phone.includes(searchInput.value.toLowerCase()) ||
      (contactsList[i].email &&
        contactsList[i].email.toLowerCase().includes(searchInput.value.toLowerCase()))
    ) {
      var favoriteBtn = contactsList[i].isFavorite
        ? `<button class="action-btn bg-transparent rounded-3 favorites-btn favorites-selected" onclick="toggleFavorites(${i})">
          <i class="fa-solid fa-star text-warning"></i>
        </button>`
        : `<button class="action-btn bg-transparent rounded-3 favorites-btn" onclick="toggleFavorites(${i})">
          <i class="fa-regular fa-star small text-muted"></i>
        </button>`;

      var emergencyBtn = contactsList[i].isEmergency
        ? `<button class="action-btn bg-transparent rounded-3 emergency-btn emergency-selected" onclick="toggleEmergency(${i})">
          <i class="fa-solid fa-heart-pulse text-danger"></i>
        </button>`
        : `<button class="action-btn bg-transparent rounded-3 emergency-btn" onclick="toggleEmergency(${i})">
          <i class="fa-regular fa-heart small text-muted"></i>
        </button>`;

      var favoriteBadge = contactsList[i].isFavorite
        ? `<div class="fav-badge rounded-circle p-2 bg-warning d-flex justify-content-center align-items-center">
            <i class="fa-solid fa-star text-white"></i>
           </div>`
        : "";

      var emergencyBadge = contactsList[i].isEmergency
        ? `<div class="emer-badge rounded-circle p-2 bg-danger d-flex justify-content-center align-items-center">
            <i class="fa-solid fa-heart-pulse text-white"></i>
           </div>`
        : "";

      var emailSection = contactsList[i].email
        ? `<div class="d-flex align-items-center gap-2 mb-2">
            <div class="card-icon email-icon rounded-3 d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-envelope small"></i>
            </div>
            <span class="text-muted small">${contactsList[i].email}</span>
           </div>`
        : "";

      var addressSection = contactsList[i].address
        ? `<div class="d-flex align-items-center gap-2">
            <div class="card-icon location-icon rounded-3 d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-location-dot small"></i>
            </div>
            <span class="text-muted small">${contactsList[i].address}</span>
           </div>`
        : "";

      var groupTag = contactsList[i].group
        ? `<span class="tag ${contactsList[
            i
          ].group.toLowerCase()}-tag">${contactsList[
            i
          ].group.toUpperCase()}</span>`
        : "";

      var emergencyTag = contactsList[i].isEmergency
        ? `<span class="tag emergency-tag">
            <i class="fa-solid fa-heart-pulse text-danger me-1"></i>Emergency
           </span>`
        : "";

      var emailButton = contactsList[i].email
        ? `<a class="action-btn email-btn d-flex justify-content-center align-items-center rounded-3"
           href="mailto:${contactsList[i].email}" onclick="event.stopPropagation();">
            <i class="fa-solid fa-envelope small"></i>
           </a>`
        : "";
      html += `
      <div class="col">
  <div
    class="contact-card card h-100 d-flex flex-column rounded-4 shadow-sm overflow-hidden"
  >
    <div class="card-body">
      <div class="d-flex align-items-start gap-3">
        <div class="position-relative">
          <div class="avatar-gradient ${
            contactsList[i].gradient
          } overflow-hidden ">
          ${
            contactsList[i].image
              ? `<img src="${contactsList[i].image}" class="w-100 h-100 object-fit-cover" />`
              : contactsList[i].avatar
          }
          </div>
          ${favoriteBadge}
          ${emergencyBadge}
          
        </div>

        <div>
          <h5 class="fw-bold mb-2">${contactsList[i].name}</h5>

          <div class="d-flex align-items-center gap-2">
            <div
              class="card-icon phone-icon rounded-2 d-flex align-items-center justify-content-center"
            >
              <i class="fa-solid fa-phone small"></i>
            </div>
            <span class="text-muted small"> ${contactsList[i].phone} </span>
          </div>
        </div>
      </div>

      <div class="mt-3">
        ${emailSection}

        ${addressSection}
      </div>

      <div class="mt-3">
        ${groupTag}
        ${emergencyTag}
      </div>
    </div>

    <div
      class="card-footer bg-light border-top d-flex justify-content-between p-3"
    >
      <div class="d-flex gap-3">
        <a
          href="tel:${contactsList[i].phone}"
          class="action-btn phone-btn rounded-3 d-flex justify-content-center align-items-center"
        >
          <i class="fa-solid fa-phone small"></i>
        </a>
        ${emailButton}
      </div>
      <div class="d-flex gap-3">
        ${favoriteBtn}
        ${emergencyBtn}
        <button class="action-btn bg-transparent rounded-3 edit-btn" id="updateBtn" data-index="${i}">
          <i class="fa-solid fa-pen small text-muted"></i>
        </button>
        <button class="action-btn rounded-3 bg-transparent delete-btn" id="deleteBtn" data-index="${i}">
          <i class="fa-solid fa-trash small text-muted"></i>
        </button>
      </div>
    </div>
  </div>
</div>
      `;
    }
  }
  contactsGrid.innerHTML = html;
}
function displayFavorites() {
  var favoritesContainer = document.querySelector("#favoritesContainer");
  var favoritesNumber = 0;
  var favoriteshtml = "";
  var favorites = contactsList.filter((contact) => contact.isFavorite);
  if (favorites.length == 0) {
    favoritesContainer.classList.remove("fit-height");
    document.querySelector("#favoritesValue").textContent = favoritesNumber;
    favoritesContainer.innerHTML = `
    <div class="h-100 d-flex justify-content-center align-items-center">
  <p class="text-secondary">No favorites yet</p>
</div>`;
    return;
  }
  for (var i = 0; i < favorites.length; i++) {
    favoritesNumber++;
    favoriteshtml += `
    <div
                class="d-flex align-items-center gap-3 p-2 bg-light rounded-3 contact-item favorites-card mb-2 "
              >
                <div>
                  <div
                    class="d-flex align-items-center justify-content-center rounded-3 shadow-sm text-white fw-bold contact-avatar overflow-hidden ${
                      favorites[i].gradient
                    }"
                  >
                    ${
                      favorites[i].image
                        ? `<img src="${favorites[i].image}" class="w-100 h-100 object-fit-cover" />`
                        : favorites[i].avatar
                    }
                  </div>
                </div>

                <div class="flex-grow-1">
                  <h4 class="fw-bold small mb-0">${favorites[i].name}</h4>
                  <p class="text-muted mb-0 small">${favorites[i].phone}</p>
                </div>

                <a
                  href="tel:${favorites[i].phone}"
                  class="d-flex align-items-center justify-content-center rounded-3 call-btn"
                >
                  <i class="fa-solid fa-phone small"></i>
                </a>
              </div>
    `;
  }
  favoritesContainer.innerHTML = favoriteshtml;
  favoritesContainer.classList.add("fit-height");
  document.querySelector("#favoritesValue").textContent = favoritesNumber;
}

function displayEmergency() {
  var emergencyContainer = document.querySelector("#emergencyContainer");
  var emergencyNumber = 0;
  var emergencyhtml = "";
  var emergency = contactsList.filter((contact) => contact.isEmergency);
  if (emergency.length == 0) {
    emergencyContainer.classList.remove("fit-height");
    document.querySelector("#emergencyValue").textContent = emergencyNumber;
    emergencyContainer.innerHTML = `
    <div class="h-100 d-flex justify-content-center align-items-center">
  <p class="text-secondary">No emergency contacts</p>
</div>`;
    return;
  }
  for (var i = 0; i < emergency.length; i++) {
    emergencyNumber++;
    emergencyhtml += `
    <div
                class="d-flex align-items-center gap-3 p-2 bg-light rounded-3 contact-item emergency-card mb-2 "
              >
                <div>
                  <div
                    class="d-flex align-items-center justify-content-center rounded-3 shadow-sm text-white fw-bold contact-avatar overflow-hidden ${
                      emergency[i].gradient
                    }"
                  >
                    ${
                      emergency[i].image
                        ? `<img src="${emergency[i].image}" class="w-100 h-100 object-fit-cover" />`
                        : emergency[i].avatar
                    }
                  </div>
                </div>
                <div class="flex-grow-1">
                  <h4 class="fw-bold small mb-0">${emergency[i].name}</h4>
                  <p class="text-muted mb-0 small">${emergency[i].phone}</p>
                </div>

                <a
                  href="tel:${emergency[i].phone}"
                  class="d-flex align-items-center justify-content-center rounded-3 call-btn"
                >
                  <i class="fa-solid fa-phone small"></i>
                </a>
              </div>
    `;
  }
  emergencyContainer.innerHTML = emergencyhtml;
  emergencyContainer.classList.add("fit-height");
  document.querySelector("#emergencyValue").textContent = emergencyNumber;
}
function saveContact(term) {
  contactImage = document.querySelector("#imageInput");
  var name = contactName.value;
  var phone = contactPhone.value;
  var email = contactEmail.value;
  var address = contactAddress.value;
  var notes = contactNotes.value;
  var group = contactGroup.value;
  var isFavorite = contactFavorite.checked;
  var isEmergency = contactEmergency.checked;
  var avatar = setAvatar(name);
  var randomGradient =
  term === "update"
    ? contactsList[currentIndex].gradient
    : gradientClasses[Math.floor(Math.random() * gradientClasses.length)];


  var imagePath;
  if (contactImage.files && contactImage.files.length > 0) {
    imagePath = `images/${contactImage.files[0].name}`;
  } else if (term === "update") {
    imagePath = contactsList[currentIndex].image;
  }

  if (!name || name === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the contact",
      timer: 2000,
      confirmButtonColor: "#7c3aed",
    });
    validateName();
    return;
  }

  if (!phone || phone === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Phone",
      text: "Please enter a phone number for the contact",
      timer: 2000,
      confirmButtonColor: "#7c3aed",
    });
    validatePhone();
    return;
  }
  if (!validateName() || !validatePhone() || !validateEmail()) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please fix the errors in the form before saving.",
      timer: 1000,
      confirmButtonColor: "#7c3aed",
    });
    return;
  }
  if (term == 'add' && !checkPhone(phone)) {
  Swal.fire({
    icon: "error",
    title: "Duplicate Phone Number",
    text: "This phone number already exists in your contacts.",
    timer: 2000,
    confirmButtonColor: "#7c3aed",
  });
  showError(contactPhone, phoneError);
  return;
  }
  if (term == 'update' && !checkPhone(phone,currentIndex)) {
  Swal.fire({
    icon: "error",
    title: "Duplicate Phone Number",
    text: "This phone number already exists in your contacts.",
    timer: 2000,
    confirmButtonColor: "#7c3aed",
  });
  showError(contactPhone, phoneError);
  return;
  }

  var contact = {
    name: name,
    phone: phone,
    email: email,
    address: address,
    notes: notes,
    group: group,
    avatar: avatar,
    image: imagePath,
    isFavorite: isFavorite,
    isEmergency: isEmergency,
    gradient: randomGradient,
  };

  term == "add"
    ? contactsList.push(contact)
    : contactsList.splice(currentIndex, 1, contact);
  localStorage.setItem("contactsList", JSON.stringify(contactsList));
  displayContacts();
  closeModal();
  if (term == "add") {
    Swal.fire({
      icon: "success",
      title: "Contact Added!",
      text: `${name} has been added to your contacts.`,
      timer: 1500,
      showConfirmButton: false,
    });
  } else if(term == 'update') {
    console.log('done');
    Swal.fire({
      title: "Contact Updated!",
      text: `${name} has been updated successfully.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  }
}
function checkPhone(phone,index) {
  for (var i = 0; i < contactsList.length; i++) {
    if(index!== undefined && i == index) continue;
    if(contactsList[i].phone == phone){
      return false;
    }
  }
  return true;
}

function validateName() {
  var value = contactName.value.trim();

  if (!nameRegex.test(value)) {
    showError(contactName, nameError);
    return false;
  }
  hideError(contactName, nameError);
  return true;
}

function validatePhone() {
  var value = contactPhone.value.trim();

  if (!phoneRegex.test(value)) {
    showError(contactPhone, phoneError);
    return false;
  }
  hideError(contactPhone, phoneError);
  return true;
}

function validateEmail() {
  var value = contactEmail.value.trim();

  if (value !== "" && !emailRegex.test(value)) {
    showError(contactEmail, emailError);
    return false;
  }
  hideError(contactEmail, emailError);
  return true;
}

function showError(input, errorText) {
  input.classList.add("input-error");
  errorText.classList.remove("d-none");
}

function hideError(input, errorText) {
  input.classList.remove("input-error");
  errorText.classList.add("d-none");
}

function hideErrors(){
  contactName.classList.remove("input-error");
  nameError.classList.add("d-none");
  contactPhone.classList.remove("input-error");
  phoneError.classList.add("d-none");
  contactEmail.classList.remove("input-error");
  emailError.classList.add("d-none");
}

function setAvatar(name) {
  var words = name.trim().split(" ");
  if (words.length == 1) avatar = words[0][0];
  else avatar = words[0][0] + words[words.length - 1][0];
  return avatar;
}
function deleteContact(index) {
  Swal.fire({
    title: "Delete Contact?",
    html: `Are you sure you want to delete <strong>${contactsList[index].name}</strong>?<br>This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      contactsList.splice(index, 1);
      localStorage.setItem("contactsList", JSON.stringify(contactsList));
      checkContacts();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Contact has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

function setUpFields(index) {
  mode = 'update';
  currentIndex = index;
  openModal();
  clearGradientClasses(imagePreview);
  if (contactsList[index].image){
    imagePreview.classList.remove("default-bg");
    imagePreview.innerHTML="";
    imagePreview.style.backgroundImage = `url("${contactsList[index].image}")`;
  }
  else{
    imagePreview.classList.remove("default-bg");
    imagePreview.style.backgroundImage="";
    imagePreview.classList.add(`${contactsList[index].gradient}`);
    imagePreview.innerHTML = contactsList[index].avatar;
  }
  contactName.value = contactsList[index].name;
  contactPhone.value = contactsList[index].phone;
  contactEmail.value = contactsList[index].email;
  contactAddress.value = contactsList[index].address;
  contactNotes.value = contactsList[index].notes;
  contactGroup.value = contactsList[index].group;
  contactFavorite.checked = contactsList[index].isFavorite;
  contactEmergency.checked = contactsList[index].isEmergency;
  document.querySelector("#modalTitle").textContent = "Update Contact";
}

function toggleFavorites(index) {
  contactsList[index].isFavorite = !contactsList[index].isFavorite;
  localStorage.setItem("contactsList", JSON.stringify(contactsList));
  displayContacts();
}
function toggleEmergency(index) {
  contactsList[index].isEmergency = !contactsList[index].isEmergency;
  localStorage.setItem("contactsList", JSON.stringify(contactsList));
  displayContacts();
}
function clearGradientClasses(element) {
  gradientClasses.forEach(cls => element.classList.remove(cls));
}
function openModal() {
  contactModal.classList.remove("d-none");
  hideErrors();
  document.querySelector("#modalTitle").textContent = "Add New Contact";
  
}
function closeModal() {
  contactModal.classList.add("d-none");
  document.querySelector('#imageInput').value = '';
}
