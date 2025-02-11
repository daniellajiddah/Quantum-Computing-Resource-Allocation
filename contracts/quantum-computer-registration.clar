;; Quantum Computer Registration Contract

;; Define data structures
(define-map quantum-computers
  { computer-id: uint }
  { owner: principal, qubits: uint, availability: bool }
)

(define-data-var last-computer-id uint u0)

;; Error codes
(define-constant err-unauthorized (err u100))
(define-constant err-invalid-computer (err u101))
(define-constant err-already-registered (err u102))

;; Define the contract owner
(define-data-var contract-owner principal tx-sender)

;; Register a new quantum computer
(define-public (register-computer (qubits uint))
  (let
    ((new-computer-id (+ (var-get last-computer-id) u1)))
    (asserts! (is-none (map-get? quantum-computers { computer-id: new-computer-id })) err-already-registered)
    (map-set quantum-computers
      { computer-id: new-computer-id }
      { owner: tx-sender, qubits: qubits, availability: true }
    )
    (var-set last-computer-id new-computer-id)
    (ok new-computer-id)
  )
)

;; Update quantum computer availability
(define-public (update-availability (computer-id uint) (is-available bool))
  (let
    ((computer (unwrap! (map-get? quantum-computers { computer-id: computer-id }) err-invalid-computer)))
    (asserts! (is-eq tx-sender (get owner computer)) err-unauthorized)
    (ok (map-set quantum-computers
      { computer-id: computer-id }
      (merge computer { availability: is-available })))
  )
)

;; Get quantum computer details
(define-read-only (get-computer (computer-id uint))
  (map-get? quantum-computers { computer-id: computer-id })
)

;; Note: A function to get all computers has been removed to simplify the contract.
;; If needed, a more efficient implementation can be added in the future.

;; Change contract owner
(define-public (set-contract-owner (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-unauthorized)
    (ok (var-set contract-owner new-owner))
  )
)

