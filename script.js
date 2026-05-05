// Navigation between sections
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
            members.sort((a, b) => a.querySelector('h4').textContent.localeCompare(b.querySelector('h4').textContent));
        } else if (filterType === 'party') {
            members.sort((a, b) => a.querySelector('.party').textContent.localeCompare(b.querySelector('.party').textContent));
        } else if (filterType === 'seats') {
            members.sort((a, b) => {
                const seatsA = parseInt(a.querySelector('.seats')?.textContent.match(/\d+/) || 0);
                const seatsB = parseInt(b.querySelector('.seats')?.textContent.match(/\d+/) || 0);
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

    homepage.classList.remove('hidden');
});

// Share functionality
function shareNews(title) {
    const url = window.location.href;
    const text = `Check out this news from the Government of Trao Phung: "${title}"`;

    if (navigator.share) {
        navigator.share({ title, text, url }).catch(err => console.log('Error sharing:', err));
    } else {
        const shareText = `${title}\n${url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('News link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
}
