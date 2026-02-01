// ===== THEME MANAGEMENT WITH LOCALSTORAGE =====
const themeToggle = document.getElementById("themeToggle");
const html = document.body;

// Function to apply theme
function applyTheme(theme) {
    html.setAttribute("data-bs-theme", theme);
    themeToggle.innerHTML = theme === "dark" 
        ? '<i class="bi bi-moon-stars-fill"></i>' 
        : '<i class="bi bi-sun-fill"></i>';
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    applyTheme(savedTheme);
}

// Toggle theme and save to localStorage
themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
});

// Initialize theme on page load
loadTheme();

// ===== FILE HANDLING WITH PREVIEW =====
let selectedFiles = [];

// Function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Function to get file icon and color class based on file type
function getFileIcon(fileName, mimeType) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    // Image files
    if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
        return { icon: 'bi-image-fill', class: 'file-icon-image' };
    }
    
    // PDF files
    if (extension === 'pdf' || mimeType === 'application/pdf') {
        return { icon: 'bi-file-pdf-fill', class: 'file-icon-pdf' };
    }
    
    // Document files
    if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension)) {
        return { icon: 'bi-file-text-fill', class: 'file-icon-doc' };
    }
    
    // Excel files
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
        return { icon: 'bi-file-excel-fill', class: 'file-icon-excel' };
    }
    
    // Video files
    if (mimeType.startsWith('video/') || ['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(extension)) {
        return { icon: 'bi-camera-video-fill', class: 'file-icon-video' };
    }
    
    // Audio files
    if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
        return { icon: 'bi-music-note-beamed', class: 'file-icon-audio' };
    }
    
    // Archive files
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
        return { icon: 'bi-file-zip-fill', class: 'file-icon-archive' };
    }
    
    // Code files
    if (['js', 'html', 'css', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'php'].includes(extension)) {
        return { icon: 'bi-code-slash', class: 'file-icon-code' };
    }
    
    // Default
    return { icon: 'bi-file-earmark-fill', class: 'file-icon-default' };
}

// Function to create file preview element
function createFilePreview(file, index) {
    const fileInfo = getFileIcon(file.name, file.type);
    const extension = file.name.split('.').pop().toLowerCase();
    
    const previewItem = document.createElement('div');
    previewItem.className = 'file-preview-item';
    previewItem.dataset.index = index;
    
    // Check if it's an image and create thumbnail
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = previewItem.querySelector('.file-icon-wrapper');
            if (img) {
                img.innerHTML = `<img src="${e.target.result}" class="file-thumbnail" alt="${file.name}">`;
            }
        };
        reader.readAsDataURL(file);
    }
    
    previewItem.innerHTML = `
        <div class="file-icon-wrapper ${fileInfo.class}">
            <i class="bi ${fileInfo.icon}"></i>
        </div>
        <div class="file-info">
            <div class="file-name" title="${file.name}">${file.name}</div>
            <div class="file-meta">
                <span class="file-size">
                    <i class="bi bi-hdd" style="font-size: 10px;"></i>
                    ${formatFileSize(file.size)}
                </span>
                <span class="file-type">${extension}</span>
            </div>
        </div>
        <button type="button" class="file-remove-btn" onclick="removeFile(${index})">
            <i class="bi bi-x-lg"></i>
        </button>
    `;
    
    return previewItem;
}

// Function to update file preview display
function updateFilePreview() {
    const container = document.getElementById('filePreviewContainer');
    
    if (selectedFiles.length === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }
    
    container.style.display = 'flex';
    container.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        if (file) {
            container.appendChild(createFilePreview(file, index));
        }
    });
}

// Function to remove a file
function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFilePreview();
    
    // Clear file input if no files remain
    const fileInput = document.getElementById('fileInput');
    if (selectedFiles.length === 0 && fileInput) {
        fileInput.value = '';
    }
}

// ===== SINGLE DOMContentLoaded =====
document.addEventListener("DOMContentLoaded", () => {
    /* ===== Sidebar toggle (Desktop & Mobile) ===== */
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.getElementById("sidebarToggle");
    const hamburgerBtn = document.getElementById("hamburgerMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    // Function to close sidebar
    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove("expanded");
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }
    }

    // Function to open sidebar
    function openSidebar() {
        if (sidebar) {
            sidebar.classList.add("expanded");
        }
        if (sidebarOverlay && window.innerWidth <= 768) {
            sidebarOverlay.classList.add("active");
        }
    }

    // Function to toggle sidebar
    function toggleSidebar(e) {
        e.stopPropagation();
        if (sidebar.classList.contains("expanded")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    // Desktop sidebar toggle
    if (sidebar && toggleBtn) {
        toggleBtn.addEventListener("click", toggleSidebar);
    }

    // Mobile hamburger menu toggle
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", toggleSidebar);
    }

    // Overlay click to close sidebar
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }

    // Close sidebar when clicking outside (desktop only)
    document.addEventListener("click", (e) => {
        if (window.innerWidth > 768) {
            if (sidebar && !sidebar.contains(e.target) && !toggleBtn?.contains(e.target)) {
                closeSidebar();
            }
        }
    });

    // Close sidebar on mobile when clicking a menu item
    if (window.innerWidth <= 768) {
        const sidebarButtons = sidebar?.querySelectorAll('.sidebar-btn');
        sidebarButtons?.forEach(btn => {
            btn.addEventListener('click', () => {
                // Don't close if it's the toggle button itself
                if (btn.id !== 'sidebarToggle') {
                    setTimeout(closeSidebar, 200);
                }
            });
        });
    }

    /* ===== Prompt auto-grow ===== */
    const textarea = document.querySelector(".prompt-input");
    if (textarea) {
        const maxLines = 10;
        textarea.addEventListener("input", () => {
            textarea.style.height = "auto";
            const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
            const maxHeight = lineHeight * maxLines;
            textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
            textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
        });
    }

    /* ===== File picker with preview ===== */
    const triggerBtn = document.getElementById("fileTrigger");
    const fileInput = document.getElementById("fileInput");
    
    if (triggerBtn && fileInput) {
        triggerBtn.addEventListener("click", () => fileInput.click());
        
        fileInput.addEventListener("change", (e) => {
            const files = Array.from(e.target.files);
            
            if (files.length > 0) {
                // Add new files to existing selection
                selectedFiles = [...selectedFiles, ...files];
                updateFilePreview();
            }
        });
    }
    
    /* ===== Form submission handler ===== */
    const promptForm = document.querySelector('.prompt-form');
    if (promptForm) {
        promptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get the message
            const message = textarea.value.trim();
            
            if (message || selectedFiles.length > 0) {
                console.log('Sending message:', message);
                console.log('With files:', selectedFiles);
                
                // Here you would handle the actual submission
                // For now, just clear the form
                textarea.value = '';
                textarea.style.height = 'auto';
                selectedFiles = [];
                updateFilePreview();
                fileInput.value = '';
            }
        });
    }

    /* ===== Handle window resize ===== */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Desktop: remove overlay
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove("active");
                }
            }
        }, 250);
    });
});

// New Chat
function newChat() {
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    
    if (chatContainer) {
        chatContainer.innerHTML = '';
        chatContainer.scrollTop = 0;
    }
    
    if (chatInput) {
        chatInput.value = '';
    }
    
    // Clear selected files
    selectedFiles = [];
    updateFilePreview();
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.value = '';
    }
}

// Profile Dropdown Handler - Fixed for mobile redirects

document.addEventListener('DOMContentLoaded', function () {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const sidebar = document.querySelector('.sidebar');

    // Create overlay
    let overlay = document.querySelector('.dropdown-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'dropdown-overlay';
        document.body.appendChild(overlay);
    }

    /* ---------------------------
       OPEN DROPDOWN
    ---------------------------- */
    function openDropdown() {
        profileDropdown.classList.add('show');
        overlay.classList.add('show');
        sidebar.classList.add('profile-open');
    }

    /* ---------------------------
       CLOSE DROPDOWN
    ---------------------------- */
    function closeDropdown() {
        profileDropdown.classList.remove('show');
        overlay.classList.remove('show');
        sidebar.classList.remove('profile-open');
    }

    /* ---------------------------
       TOGGLE DROPDOWN
    ---------------------------- */
    profileTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = profileDropdown.classList.contains('show');
        isOpen ? closeDropdown() : openDropdown();
    });

    /* ---------------------------
       OVERLAY CLICK → CLOSE ONLY DROPDOWN
       (NOT SIDEBAR)
    ---------------------------- */
    overlay.addEventListener('click', function (e) {
        e.stopPropagation();
        closeDropdown();
    });

    /* ---------------------------
       PREVENT CLOSING WHEN CLICKING INSIDE DROPDOWN
    ---------------------------- */
    profileDropdown.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    /* ---------------------------
       MENU ITEM HANDLING
    ---------------------------- */
    profileDropdown.querySelectorAll('.dropdown-menu-item').forEach(item => {
        item.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (!href || href === '#') {
                e.preventDefault();
            }

            closeDropdown();
        });
    });

    /* ---------------------------
       ESC KEY SUPPORT
    ---------------------------- */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeDropdown();
        }
    });
});

