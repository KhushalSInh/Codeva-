// To-Do List Application
class TodoApp {
    constructor() {
        this.tasks = [];
        this.filteredTasks = [];
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.currentSort = 'newest';
        this.searchQuery = '';
        this.currentPage = 1;
        this.tasksPerPage = 5;
        this.selectedTasks = new Set();
        this.currentTaskId = null;
        
        // Initialize the app
        this.init();
    }
    
    init() {
        // Load tasks from localStorage
        this.loadTasks();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Render initial state
        this.updateStats();
        this.renderTasks();
        
        // Set today's date as default for due date inputs
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskDueDate').min = today;
        document.getElementById('editTaskDueDate').min = today;
    }
    
    // Task Management Methods
    addTask(taskData) {
        const task = {
            id: Date.now().toString(),
            title: taskData.title.trim(),
            category: taskData.category || 'personal',
            priority: taskData.priority || 'medium',
            dueDate: taskData.dueDate || null,
            notes: taskData.notes || '',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.tasks.unshift(task); // Add to beginning
        this.saveTasks();
        this.updateStats();
        this.renderTasks();
        this.showToast('Task added successfully!', 'success');
        return task;
    }
    
    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
            this.showToast('Task updated successfully!', 'success');
            return true;
        }
        return false;
    }
    
    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
            this.showToast('Task deleted successfully!', 'success');
            return true;
        }
        return false;
    }
    
    toggleTaskComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
            this.showToast(`Task marked as ${task.completed ? 'complete' : 'incomplete'}!`, 'success');
            return true;
        }
        return false;
    }
    
    // Filtering and Sorting
    filterTasks() {
        this.filteredTasks = this.tasks.filter(task => {
            // Apply status filter
            if (this.currentFilter === 'pending' && task.completed) return false;
            if (this.currentFilter === 'completed' && !task.completed) return false;
            
            // Apply category filter
            if (this.currentCategory !== 'all' && task.category !== this.currentCategory) return false;
            
            // Apply search query
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                const matchesTitle = task.title.toLowerCase().includes(query);
                const matchesNotes = task.notes.toLowerCase().includes(query);
                if (!matchesTitle && !matchesNotes) return false;
            }
            
            // Apply due today filter
            if (this.currentFilter === 'today') {
                const today = new Date().toISOString().split('T')[0];
                if (task.dueDate !== today) return false;
            }
            
            return true;
        });
        
        // Sort tasks
        this.sortTasks();
        
        // Update pagination
        this.updatePagination();
    }
    
    sortTasks() {
        switch (this.currentSort) {
            case 'newest':
                this.filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                this.filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                this.filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            case 'dueDate':
                this.filteredTasks.sort((a, b) => {
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
                break;
            case 'alphabetical':
                this.filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }
    
    // Pagination
    updatePagination() {
        const totalPages = Math.ceil(this.filteredTasks.length / this.tasksPerPage);
        document.getElementById('totalPages').textContent = totalPages || 1;
        
        // Adjust current page if needed
        if (this.currentPage > totalPages && totalPages > 0) {
            this.currentPage = totalPages;
        }
        
        // Update pagination buttons
        document.getElementById('prevPageBtn').disabled = this.currentPage === 1;
        document.getElementById('nextPageBtn').disabled = this.currentPage === totalPages || totalPages === 0;
    }
    
    getCurrentPageTasks() {
        const startIndex = (this.currentPage - 1) * this.tasksPerPage;
        const endIndex = startIndex + this.tasksPerPage;
        return this.filteredTasks.slice(startIndex, endIndex);
    }
    
    // Rendering
    renderTasks() {
        this.filterTasks();
        const tasksContainer = document.getElementById('tasksContainer');
        const emptyState = document.getElementById('emptyState');
        const pageTasks = this.getCurrentPageTasks();
        
        if (pageTasks.length === 0) {
            tasksContainer.innerHTML = '';
            tasksContainer.appendChild(emptyState);
            emptyState.style.display = 'flex';
            return;
        }
        
        emptyState.style.display = 'none';
        
        tasksContainer.innerHTML = pageTasks.map(task => this.createTaskElement(task)).join('');
        
        // Update pagination info
        document.getElementById('currentPage').textContent = this.currentPage;
        
        // Update tasks title
        this.updateTasksTitle();
    }
    
    createTaskElement(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let dueStatus = '';
        if (dueDate) {
            dueDate.setHours(0, 0, 0, 0);
            if (dueDate < today) {
                dueStatus = 'overdue';
            } else if (dueDate.getTime() === today.getTime()) {
                dueStatus = 'today';
            }
        }
        
        const dueDateText = dueDate ? dueDate.toLocaleDateString() : 'No due date';
        const createdDate = new Date(task.createdAt).toLocaleDateString();
        
        return `
            <div class="task-card ${task.completed ? 'completed' : ''} ${task.priority}-priority ${this.selectedTasks.has(task.id) ? 'selected' : ''}" data-id="${task.id}">
                <div class="task-checkbox">
                    <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                    <label for="task-${task.id}" class="checkbox-custom">
                        <i class="fas fa-check"></i>
                    </label>
                </div>
                <div class="task-content">
                    <div class="task-header">
                        <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                        <div class="task-meta">
                            <span class="task-category">
                                <i class="fas ${this.getCategoryIcon(task.category)}"></i>
                                ${this.capitalizeFirst(task.category)}
                            </span>
                            <span class="task-priority ${task.priority}">
                                ${this.capitalizeFirst(task.priority)} Priority
                            </span>
                            <span class="task-due ${dueStatus}">
                                <i class="fas fa-calendar"></i>
                                ${dueDateText}
                            </span>
                        </div>
                    </div>
                    ${task.notes ? `
                        <p class="task-notes">${this.escapeHtml(task.notes)}</p>
                    ` : ''}
                </div>
                <div class="task-actions">
                    <button class="task-action-btn view" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="task-action-btn edit" title="Edit Task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn delete" title="Delete Task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    updateTasksTitle() {
        const title = document.getElementById('tasksTitle');
        let filterText = '';
        
        switch (this.currentFilter) {
            case 'pending': filterText = 'Pending'; break;
            case 'completed': filterText = 'Completed'; break;
            case 'today': filterText = 'Due Today'; break;
            default: filterText = 'All';
        }
        
        let categoryText = '';
        if (this.currentCategory !== 'all') {
            categoryText = ` • ${this.capitalizeFirst(this.currentCategory)}`;
        }
        
        title.textContent = `${filterText} Tasks${categoryText}`;
    }
    
    // Stats and Progress
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        const today = new Date().toISOString().split('T')[0];
        const dueToday = this.tasks.filter(task => 
            task.dueDate === today && !task.completed
        ).length;
        
        // Update header stats
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        
        // Update progress section
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('dueTodayCount').textContent = dueToday;
        
        // Update progress bar
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        const progressFill = document.getElementById('progressFill');
        const progressPercentageText = document.getElementById('progressPercentage');
        
        progressFill.style.width = `${progressPercentage}%`;
        progressPercentageText.textContent = `${progressPercentage}%`;
        
        // Color code progress bar
        if (progressPercentage < 30) {
            progressFill.style.background = 'linear-gradient(90deg, #e74c3c, #f39c12)';
        } else if (progressPercentage < 70) {
            progressFill.style.background = 'linear-gradient(90deg, #f39c12, #3498db)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #3498db, #2ecc71)';
        }
    }
    
    // Local Storage
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }
    
    loadTasks() {
        const saved = localStorage.getItem('todoTasks');
        if (saved) {
            this.tasks = JSON.parse(saved);
        }
    }
    
    // Export/Import
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `tasks-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showToast('Tasks exported successfully!', 'success');
    }
    
    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    // Add imported tasks with new IDs
                    importedTasks.forEach(task => {
                        task.id = Date.now() + Math.random().toString(36).substr(2, 9);
                        task.createdAt = new Date().toISOString();
                        task.updatedAt = new Date().toISOString();
                        this.tasks.unshift(task);
                    });
                    
                    this.saveTasks();
                    this.updateStats();
                    this.renderTasks();
                    this.showToast(`Successfully imported ${importedTasks.length} tasks!`, 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showToast('Error importing tasks. Invalid file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
    
    // Event Listeners
    initEventListeners() {
        // Add task form
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });
        
        // Clear form button
        document.getElementById('clearFormBtn').addEventListener('click', () => {
            document.getElementById('taskForm').reset();
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.closest('.filter-btn'));
            });
        });
        
        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryChange(e.target.closest('.category-btn'));
            });
        });
        
        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.currentPage = 1;
            this.renderTasks();
        });
        
        // Clear search
        document.getElementById('clearSearchBtn').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            this.searchQuery = '';
            this.renderTasks();
        });
        
        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });
        
        // Pagination buttons
        document.getElementById('prevPageBtn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTasks();
            }
        });
        
        document.getElementById('nextPageBtn').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredTasks.length / this.tasksPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTasks();
            }
        });
        
        // Clear all tasks
        document.getElementById('clearAllBtn').addEventListener('click', () => {
            if (this.tasks.length > 0) {
                if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
                    this.tasks = [];
                    this.saveTasks();
                    this.updateStats();
                    this.renderTasks();
                    this.showToast('All tasks cleared!', 'success');
                }
            }
        });
        
        // Bulk actions
        document.getElementById('selectAllBtn').addEventListener('click', () => {
            this.handleSelectAll();
        });
        
        document.getElementById('markSelectedCompleteBtn').addEventListener('click', () => {
            this.handleMarkSelectedComplete();
        });
        
        document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
            this.handleDeleteSelected();
        });
        
        // Export/Import
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportTasks();
        });
        
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        
        // Create hidden file input for import
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.id = 'importFile';
        fileInput.addEventListener('change', (e) => this.importTasks(e));
        document.body.appendChild(fileInput);
        
        // Theme toggle
        document.getElementById('themeToggleBtn').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Close toast
        document.getElementById('closeToastBtn').addEventListener('click', () => {
            this.hideToast();
        });
        
        // Task container delegation
        document.getElementById('tasksContainer').addEventListener('click', (e) => {
            this.handleTaskContainerClick(e);
        });
        
        // Modals
        this.initModalListeners();
    }
    
    initModalListeners() {
        // Task details modal
        const taskDetailsModal = document.getElementById('taskDetailsModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const closeDetailsBtn = document.getElementById('closeDetailsBtn');
        
        closeModalBtn.addEventListener('click', () => {
            taskDetailsModal.classList.remove('active');
        });
        
        closeDetailsBtn.addEventListener('click', () => {
            taskDetailsModal.classList.remove('active');
        });
        
        taskDetailsModal.addEventListener('click', (e) => {
            if (e.target === taskDetailsModal) {
                taskDetailsModal.classList.remove('active');
            }
        });
        
        // Edit task modal
        const editTaskModal = document.getElementById('editTaskModal');
        const closeEditModalBtn = document.getElementById('closeEditModalBtn');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        
        closeEditModalBtn.addEventListener('click', () => {
            editTaskModal.classList.remove('active');
        });
        
        cancelEditBtn.addEventListener('click', () => {
            editTaskModal.classList.remove('active');
        });
        
        editTaskModal.addEventListener('click', (e) => {
            if (e.target === editTaskModal) {
                editTaskModal.classList.remove('active');
            }
        });
        
        // Edit task form
        document.getElementById('editTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditTask();
        });
        
        // Edit task button in details modal
        document.getElementById('editTaskBtn').addEventListener('click', () => {
            document.getElementById('taskDetailsModal').classList.remove('active');
            this.openEditModal(this.currentTaskId);
        });
    }
    
    // Event Handlers
    handleAddTask() {
        const titleInput = document.getElementById('taskTitle');
        const title = titleInput.value.trim();
        
        if (!title) {
            document.getElementById('titleError').textContent = 'Task title is required';
            titleInput.focus();
            return;
        }
        
        const taskData = {
            title: title,
            category: document.getElementById('taskCategory').value,
            priority: document.querySelector('input[name="priority"]:checked').value,
            dueDate: document.getElementById('taskDueDate').value || null,
            notes: document.getElementById('taskNotes').value.trim()
        };
        
        this.addTask(taskData);
        document.getElementById('taskForm').reset();
        document.getElementById('titleError').textContent = '';
    }
    
    handleFilterChange(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        this.currentFilter = button.dataset.filter;
        this.currentPage = 1;
        this.renderTasks();
    }
    
    handleCategoryChange(button) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        this.currentCategory = button.dataset.category;
        this.currentPage = 1;
        this.renderTasks();
    }
    
    handleTaskContainerClick(e) {
        const taskCard = e.target.closest('.task-card');
        if (!taskCard) return;
        
        const taskId = taskCard.dataset.id;
        
        // Checkbox click
        if (e.target.closest('.task-checkbox')) {
            const checkbox = taskCard.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                this.toggleTaskComplete(taskId);
            }
            return;
        }
        
        // View button click
        if (e.target.closest('.task-action-btn.view')) {
            this.showTaskDetails(taskId);
            return;
        }
        
        // Edit button click
        if (e.target.closest('.task-action-btn.edit')) {
            this.openEditModal(taskId);
            return;
        }
        
        // Delete button click
        if (e.target.closest('.task-action-btn.delete')) {
            if (confirm('Are you sure you want to delete this task?')) {
                this.deleteTask(taskId);
            }
            return;
        }
        
        // Task card click (for selection)
        if (e.target === taskCard || e.target.closest('.task-content')) {
            this.toggleTaskSelection(taskId);
        }
    }
    
    handleSelectAll() {
        const pageTasks = this.getCurrentPageTasks();
        const allSelected = pageTasks.every(task => this.selectedTasks.has(task.id));
        
        if (allSelected) {
            // Deselect all
            pageTasks.forEach(task => this.selectedTasks.delete(task.id));
        } else {
            // Select all
            pageTasks.forEach(task => this.selectedTasks.add(task.id));
        }
        
        this.renderTasks();
    }
    
    handleMarkSelectedComplete() {
        if (this.selectedTasks.size === 0) {
            this.showToast('No tasks selected', 'warning');
            return;
        }
        
        this.selectedTasks.forEach(taskId => {
            const task = this.tasks.find(t => t.id === taskId);
            if (task && !task.completed) {
                task.completed = true;
                task.updatedAt = new Date().toISOString();
            }
        });
        
        this.saveTasks();
        this.updateStats();
        this.renderTasks();
        this.showToast(`Marked ${this.selectedTasks.size} tasks as complete`, 'success');
        this.selectedTasks.clear();
    }
    
    handleDeleteSelected() {
        if (this.selectedTasks.size === 0) {
            this.showToast('No tasks selected', 'warning');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${this.selectedTasks.size} selected tasks?`)) {
            this.tasks = this.tasks.filter(task => !this.selectedTasks.has(task.id));
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
            this.showToast(`Deleted ${this.selectedTasks.size} tasks`, 'success');
            this.selectedTasks.clear();
        }
    }
    
    handleEditTask() {
        const taskId = document.getElementById('editTaskId').value;
        const updates = {
            title: document.getElementById('editTaskTitle').value.trim(),
            category: document.getElementById('editTaskCategory').value,
            priority: document.querySelector('input[name="editPriority"]:checked').value,
            dueDate: document.getElementById('editTaskDueDate').value || null,
            notes: document.getElementById('editTaskNotes').value.trim(),
            completed: document.getElementById('editTaskCompleted').checked
        };
        
        if (this.updateTask(taskId, updates)) {
            document.getElementById('editTaskModal').classList.remove('active');
        }
    }
    
    // Modal Functions
    showTaskDetails(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        this.currentTaskId = taskId;
        
        // Populate modal
        document.getElementById('modalTaskTitle').textContent = task.title;
        document.getElementById('modalTaskStatus').textContent = task.completed ? 'Completed' : 'Pending';
        document.getElementById('modalTaskPriority').innerHTML = this.getPriorityBadge(task.priority);
        document.getElementById('modalTaskCategory').innerHTML = this.getCategoryBadge(task.category);
        document.getElementById('modalTaskDueDate').textContent = task.dueDate 
            ? new Date(task.dueDate).toLocaleDateString() 
            : 'No due date';
        document.getElementById('modalTaskCreated').textContent = new Date(task.createdAt).toLocaleString();
        document.getElementById('modalTaskNotes').textContent = task.notes || 'No notes';
        
        // Show modal
        document.getElementById('taskDetailsModal').classList.add('active');
    }
    
    openEditModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        this.currentTaskId = taskId;
        
        // Populate form
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskCategory').value = task.category;
        
        // Set priority radio
        document.querySelector(`input[name="editPriority"][value="${task.priority}"]`).checked = true;
        
        // Set due date
        document.getElementById('editTaskDueDate').value = task.dueDate || '';
        
        // Set notes
        document.getElementById('editTaskNotes').value = task.notes || '';
        
        // Set completed checkbox
        document.getElementById('editTaskCompleted').checked = task.completed;
        
        // Show modal
        document.getElementById('editTaskModal').classList.add('active');
    }
    
    // Utility Methods
    toggleTaskSelection(taskId) {
        if (this.selectedTasks.has(taskId)) {
            this.selectedTasks.delete(taskId);
        } else {
            this.selectedTasks.add(taskId);
        }
        this.renderTasks();
    }
    
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const icon = document.querySelector('#themeToggleBtn i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
            document.querySelector('#themeToggleBtn span').textContent = 'Light Mode';
            localStorage.setItem('todoTheme', 'dark');
        } else {
            icon.className = 'fas fa-moon';
            document.querySelector('#themeToggleBtn span').textContent = 'Dark Mode';
            localStorage.setItem('todoTheme', 'light');
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = toast.querySelector('.toast-icon');
        
        // Set message and type
        toastMessage.textContent = message;
        toast.className = `toast active ${type}`;
        
        // Set icon based on type
        let iconClass = '';
        switch (type) {
            case 'success': iconClass = 'fas fa-check-circle'; break;
            case 'error': iconClass = 'fas fa-exclamation-circle'; break;
            case 'warning': iconClass = 'fas fa-exclamation-triangle'; break;
            default: iconClass = 'fas fa-info-circle';
        }
        toastIcon.className = `toast-icon ${iconClass}`;
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            this.hideToast();
        }, 3000);
    }
    
    hideToast() {
        document.getElementById('toast').classList.remove('active');
    }
    
    getCategoryIcon(category) {
        const icons = {
            personal: 'fa-user',
            work: 'fa-briefcase',
            shopping: 'fa-shopping-cart',
            health: 'fa-heart-pulse',
            education: 'fa-graduation-cap',
            other: 'fa-star'
        };
        return icons[category] || 'fa-tag';
    }
    
    getCategoryBadge(category) {
        const colors = {
            personal: '#3498db',
            work: '#9b59b6',
            shopping: '#2ecc71',
            health: '#e74c3c',
            education: '#f39c12',
            other: '#95a5a6'
        };
        
        return `<span class="task-category" style="background-color: ${colors[category] || '#95a5a6'}20; color: ${colors[category] || '#95a5a6'}">
            <i class="fas ${this.getCategoryIcon(category)}"></i>
            ${this.capitalizeFirst(category)}
        </span>`;
    }
    
    getPriorityBadge(priority) {
        const colors = {
            high: '#e74c3c',
            medium: '#f39c12',
            low: '#2ecc71'
        };
        
        return `<span class="priority-badge ${priority}" style="background-color: ${colors[priority]}20; color: ${colors[priority]}">
            ${this.capitalizeFirst(priority)} Priority
        </span>`;
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Initialize theme from localStorage
    loadTheme() {
        const savedTheme = localStorage.getItem('todoTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const icon = document.querySelector('#themeToggleBtn i');
            icon.className = 'fas fa-sun';
            document.querySelector('#themeToggleBtn span').textContent = 'Light Mode';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    app.loadTheme();
    
    // Make app available globally for debugging
    window.todoApp = app;
});