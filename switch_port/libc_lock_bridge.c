/* Bridge: newlib>=4.6 patched headers call __libc_* lock/cond helpers,
 * while this libnx tree's newlib.c implements __syscall_* equivalents.
 * Type-wise both use the aarch64 machine lock.h, so a direct shim works.
 */
#include <stdint.h>
#include <sys/lock.h>

void __syscall_lock_acquire(_LOCK_T *lock);
int __syscall_lock_try_acquire(_LOCK_T *lock);
void __syscall_lock_release(_LOCK_T *lock);
void __syscall_lock_acquire_recursive(_LOCK_RECURSIVE_T *lock);
int __syscall_lock_try_acquire_recursive(_LOCK_RECURSIVE_T *lock);
void __syscall_lock_release_recursive(_LOCK_RECURSIVE_T *lock);
int __syscall_cond_signal(_COND_T *cond);
int __syscall_cond_broadcast(_COND_T *cond);
int __syscall_cond_wait(_COND_T *cond, _LOCK_T *lock, uint64_t timeout_ns);
int __syscall_cond_wait_recursive(_COND_T *cond, _LOCK_RECURSIVE_T *lock, uint64_t timeout_ns);

void __libc_lock_acquire(_LOCK_T *lock) { __syscall_lock_acquire(lock); }
int __libc_lock_try_acquire(_LOCK_T *lock) { return __syscall_lock_try_acquire(lock); }
void __libc_lock_release(_LOCK_T *lock) { __syscall_lock_release(lock); }
void __libc_lock_acquire_recursive(_LOCK_RECURSIVE_T *lock) { __syscall_lock_acquire_recursive(lock); }
int __libc_lock_try_acquire_recursive(_LOCK_RECURSIVE_T *lock) { return __syscall_lock_try_acquire_recursive(lock); }
void __libc_lock_release_recursive(_LOCK_RECURSIVE_T *lock) { __syscall_lock_release_recursive(lock); }
int __libc_cond_signal(_COND_T *cond) { return __syscall_cond_signal(cond); }
int __libc_cond_broadcast(_COND_T *cond) { return __syscall_cond_broadcast(cond); }
int __libc_cond_wait(_COND_T *cond, _LOCK_T *lock, uint64_t timeout_ns) { return __syscall_cond_wait(cond, lock, timeout_ns); }
int __libc_cond_wait_recursive(_COND_T *cond, _LOCK_RECURSIVE_T *lock, uint64_t timeout_ns) { return __syscall_cond_wait_recursive(cond, lock, timeout_ns); }
