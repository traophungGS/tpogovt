// Navigation between sections
document.addEventListener('DOMContentLoaded', function() {
    const navBoxes = document.querySelectorAll('.nav-box');
    const sections = document.querySelectorAll('.section');
    const homepage = document.querySelector('.homepage');
    const mainNav = document.querySelector('.main-nav');
    const mainNavLinks = document.querySelectorAll('.main-nav a');

    navBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    mainNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
        });
    });

    function showSection(sectionId) {
        homepage.classList.add('hidden');
        sections.forEach(section => section.classList.add('hidden'));
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const section = this.closest('.section');
            
            // Remove active class from all buttons in this section
            section.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents in this section
            section.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected tab content
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });

    // Search functionality
    const searchBoxes = document.querySelectorAll('.search-box');
    searchBoxes.forEach(searchBox => {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const container = this.closest('.tab-content');
            
            if (container.querySelector('.members-list')) {
                filterMembers(container, searchTerm);
            } else if (container.querySelector('.committees-list')) {
                filterCommittees(container, searchTerm);
            } else if (container.querySelector('.news-list')) {
                filterNews(container, searchTerm);
            }
        });
    });

    function filterMembers(container, searchTerm) {
        const members = container.querySelectorAll('.member');
        members.forEach(member => {
            const text = member.textContent.toLowerCase();
            member.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }

    function filterCommittees(container, searchTerm) {
        const committees = container.querySelectorAll('.committee');
        committees.forEach(committee => {
            const text = committee.textContent.toLowerCase();
            committee.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }

    function filterNews(container, searchTerm) {
        const newsItems = container.querySelectorAll('.news-item');
        newsItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const container = this.closest('.search-filter').nextElementSibling;
            
            if (container.querySelector('.members-list')) {
                sortMembers(container, filter);
            }
        });
    });

    function sortMembers(container, filterType) {
        const membersList = container.querySelector('.members-list');
        const members = Array.from(membersList.querySelectorAll('.member'));

        if (filterType === 'a-z') {
            members.sort((a, b) => {
                const nameA = a.querySelector('h4').textContent;
                const nameB = b.querySelector('h4').textContent;
                return nameA.localeCompare(nameB);
            });
        } else if (filterType === 'party') {
            members.sort((a, b) => {
                const partyA = a.querySelector('.party').textContent;
                const partyB = b.querySelector('.party').textContent;
                return partyA.localeCompare(partyB);
            });
        } else if (filterType === 'seats') {
            members.sort((a, b) => {
                const seatsA = parseInt(a.querySelector('.seats')?.textContent.match(/\d+/) || 0);
                const seatsB = parseInt(b.querySelector('.seats')?.textContent.match(/\d+/) || 0);
                return seatsA - seatsB;
            });
        }

        // Re-append sorted members
        members.forEach(member => {
            membersList.appendChild(member);
        });
    }

    // Show homepage initially
    homepage.classList.remove('hidden');
});

// Share functionality
function shareNews(title) {
    const url = window.location.href;
    const text = `Check out this news from the Government of Trao Phung: "${title}"`;

    // Try using Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        const shareText = `${title}\n${url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('News link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
}
