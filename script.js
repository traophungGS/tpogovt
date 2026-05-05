document.addEventListener('DOMContentLoaded', function() {
    const homepage = document.getElementById('homepage');
    const navBoxes = document.querySelectorAll('.nav-box');
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('.section');
    const tabButtons = document.querySelectorAll('.tab-button');
    const searchBoxes = document.querySelectorAll('.search-box');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Show homepage initially
    homepage.classList.remove('hidden');

    // Function to show section
    function showSection(sectionId) {
        homepage.classList.add('hidden');

        sections.forEach(section => {
            section.classList.add('hidden');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            window.scrollTo({
                top: targetSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }

    // Homepage boxes navigation
    navBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Top nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentSection = this.closest('.section');

            parentSection.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            parentSection.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            this.classList.add('active');

            const tabId = this.getAttribute('data-tab');
            const targetTab = document.getElementById(tabId);

            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // Search
    searchBoxes.forEach(searchBox => {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const container = this.closest('.search-filter').nextElementSibling;

            if (!container) return;

            const items = container.querySelectorAll('.member, .committee, .news-item');

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    });

    // Filters
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const container = this.closest('.search-filter').nextElementSibling;

            if (container) {
                sortMembers(container, filter);
            }
        });
    });

    function sortMembers(container, filterType) {
        const membersList = container;

        if (!membersList) return;

        const members = Array.from(membersList.querySelectorAll('.member'));

        if (filterType === 'a-z') {
            members.sort((a, b) =>
                a.querySelector('h4').textContent.localeCompare(
                    b.querySelector('h4').textContent
                )
            );
        } else if (filterType === 'party') {
            members.sort((a, b) =>
                (a.querySelector('.party')?.textContent || '').localeCompare(
                    b.querySelector('.party')?.textContent || ''
                )
            );
        } else if (filterType === 'seats') {
            members.sort((a, b) => {
                const seatsA = parseInt(
                    a.querySelector('.seats')?.textContent.match(/\d+/)?.[0] || 0
                );
                const seatsB = parseInt(
                    b.querySelector('.seats')?.textContent.match(/\d+/)?.[0] || 0
                );
                return seatsA - seatsB;
            });
        }

        members.forEach(member => membersList.appendChild(member));
    }

    // Clickable member profiles
    const clickableMembers = document.querySelectorAll('.clickable-member');

    clickableMembers.forEach(member => {
        member.addEventListener('click', function(e) {
            if (e.target.tagName.toLowerCase() === 'button') return;

            const profile = this.querySelector('.member-profile');

            if (profile) {
                profile.classList.toggle('hidden');
            }
        });
    });
});

// Share function
function shareNews(title) {
    const url = window.location.href;
    const text = `Check out this news from the Government of Trao Phung: "${title}"`;

    if (navigator.share) {
        navigator.share({
            title,
            text,
            url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        const shareText = `${title}\n${url}`;

        navigator.clipboard.writeText(shareText)
            .then(() => {
                alert('News link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    }
}
