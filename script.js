
const peopleData = [
    {
        id: 1,
        name: "miert metaphor",
        role: "owner",
        username: "@wheback",
        description: "создатель проекта mani.net. ищу уязвимости в сайтах",
        telegram: "wheback",
        details: "создатель проекта mani.net. ищу уязвимости в сайтах",
        avatar: "img/avatar1.jpg"
    },
        {
        id: 2,
        name: "Crownes & Убийцев",
        role: "co-owner",
        username: "@payauction",
        description: " I smoke marijuana and don't love anyone.If she tries to take my money, I'll punch her in the face",
        telegram: "payauction",
        details: "co-owner листа метафора",
        avatar: "img/avatar2.jpg"
    },
        {
        id: 3,
        name: "вейzov друн",
        role: "участник",
        username: "@attakweizov",
        description: "мир всему миру @hwzuw / друн - @drunnwe / отзывы - @jwiwzbw",
        telegram: "attakweizov",
        details: "блог - https://t.me/+_qPOFvW5KIsyZGI0",
        avatar: "img/avatar3.jpg"
    },
        {
        id: 4,
        name: "правозглашённый студент",
        role: "участник",
        username: "@qbovz",
        description: "превосходства – это преимущество перед кем‑либо или чем‑либо по какому‑либо признаку",
        telegram: "qbovz",
        details: "DM - qbovz.t.me",
        avatar: "img/avatar1.jpg"
    },
];

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function getInitial(name) {
    if (!name || name.length === 0) return '?';
    return name.charAt(0).toUpperCase();
}

function showSkeleton() {
    const container = document.getElementById('people-container');
    if (!container) return;
    
    const skeletonCount = 5;
    container.innerHTML = '';
    
    for (let i = 0; i < skeletonCount; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-card';
        skeleton.innerHTML = `
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
                <div class="skeleton-avatar"></div>
                <div style="flex: 1;">
                    <div class="skeleton-line short" style="margin: 0 0 8px 0;"></div>
                    <div class="skeleton-line" style="width: 40%; height: 10px; margin: 0;"></div>
                </div>
            </div>
            <div class="skeleton-line long" style="margin: 8px 0;"></div>
            <div class="skeleton-line medium" style="margin: 8px 0;"></div>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #252525;">
                <div class="skeleton-line" style="width: 35%; height: 28px; border-radius: 32px;"></div>
            </div>
        `;
        container.appendChild(skeleton);
    }
}

function loadAvatar(imgElement, src, name) {
    const testImg = new Image();
    testImg.onload = function() {
        imgElement.src = src;
        imgElement.style.display = 'block';
        const parent = imgElement.parentElement;
        const placeholder = parent.querySelector('.avatar-place');
        if (placeholder) placeholder.remove();
    };
    testImg.onerror = function() {
        imgElement.style.display = 'none';
        const parent = imgElement.parentElement;
        if (!parent.querySelector('.avatar-place')) {
            const avatarPlace = document.createElement('div');
            avatarPlace.className = 'avatar-place';
            avatarPlace.textContent = getInitial(name);
            parent.appendChild(avatarPlace);
        }
    };
    testImg.src = src;
}

function createPersonCard(person, index) {
    const card = document.createElement('div');
    card.className = 'person-card';
    card.dataset.id = person.id;
    card.style.animationDelay = (index * 0.05) + 's';

    card.innerHTML = `
        <div class="card-header">
            <div style="position: relative;">
                <img class="avatar-img" id="avatar-${person.id}" src="" style="display: none;">
            </div>
            <div>
                <div class="person-name">${escapeHtml(person.name)}</div>
                <div class="person-role">${escapeHtml(person.role)}</div>
            </div>
        </div>
        <div class="person-desc">${escapeHtml(person.description)}</div>
        <div class="person-contact">
            <a href="https://t.me/${person.telegram}" target="_blank" class="tg-link" onclick="event.stopPropagation()">
                <i class="fab fa-telegram"></i> @${person.telegram}
            </a>
        </div>
    `;

    const img = card.querySelector(`#avatar-${person.id}`);
    if (img) {
        const avatarUrl = person.avatar || `img/avatar${person.id}.jpg`;
        loadAvatar(img, avatarUrl, person.name);
    }

    card.addEventListener('click', (e) => {
        if (e.target.closest('.tg-link')) return;
        showPersonModal(person.id);
    });

    return card;
}

function renderPeopleList(filterText = '') {
    const container = document.getElementById('people-container');
    if (!container) return;
    
    showSkeleton();
    
    setTimeout(() => {
        const lowerFilter = filterText.trim().toLowerCase();
        let filtered = [...peopleData];
        
        if (lowerFilter !== '') {
            filtered = peopleData.filter(person => 
                person.name.toLowerCase().includes(lowerFilter) ||
                person.role.toLowerCase().includes(lowerFilter) ||
                person.description.toLowerCase().includes(lowerFilter) ||
                person.username.toLowerCase().includes(lowerFilter)
            );
        }
        
        const countSpan = document.getElementById('count-number');
        if (countSpan) countSpan.innerText = filtered.length;
        
        if (filtered.length === 0) {
            container.innerHTML = `<div class="empty-state">никого не найдено</div>`;
            return;
        }
        
        container.innerHTML = '';
        filtered.forEach((person, index) => {
            container.appendChild(createPersonCard(person, index));
        });
    }, 500);
}

function showPersonModal(personId) {
    const person = peopleData.find(p => p.id === personId);
    if (!person) return;
    
    const modal = document.getElementById('profile-modal');
    const modalName = document.getElementById('modal-name');
    const modalBody = document.getElementById('modal-body-content');
    
    if (!modal || !modalBody) return;
    
    modalName.innerText = person.name;
    
    modalBody.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">роль</div>
            <div class="detail-value"><strong>${escapeHtml(person.role)}</strong></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">telegram</div>
            <div class="detail-value">
                <a href="https://t.me/${person.telegram}" target="_blank" style="color:#b0b0b0; text-decoration:none;">@${person.telegram}</a>
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">описание</div>
            <div class="detail-value">${escapeHtml(person.description)}</div>
        </div>
        <hr>
        <div class="detail-row">
            <div class="detail-label">подробнее</div>
            <div class="detail-value">${escapeHtml(person.details || 'нет информации')}</div>
        </div>
        <div style="margin-top: 22px;">
            <a href="https://t.me/${person.telegram}" target="_blank" class="modal-tg">
                <i class="fab fa-telegram"></i> написать в telegram
            </a>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initSearch() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderPeopleList(e.target.value);
        });
    }
}

function initModalEvents() {
    const modal = document.getElementById('profile-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function initApp() {
    renderPeopleList('');
    initSearch();
    initModalEvents();
}

initApp();
