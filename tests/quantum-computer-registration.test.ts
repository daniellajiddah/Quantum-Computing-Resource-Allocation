import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for quantum computers
const quantumComputers = new Map<number, { owner: string; qubits: number; availability: boolean }>()
let lastComputerId = 0
let contractOwner = "owner"

// Mock functions to simulate contract behavior
function registerComputer(qubits: number, owner: string) {
  const newComputerId = ++lastComputerId
  if (quantumComputers.has(newComputerId)) throw new Error("Already registered")
  quantumComputers.set(newComputerId, { owner, qubits, availability: true })
  return newComputerId
}

function updateAvailability(computerId: number, isAvailable: boolean, caller: string) {
  const computer = quantumComputers.get(computerId)
  if (!computer) throw new Error("Invalid computer")
  if (computer.owner !== caller) throw new Error("Unauthorized")
  computer.availability = isAvailable
  quantumComputers.set(computerId, computer)
  return true
}

function getComputer(computerId: number) {
  return quantumComputers.get(computerId)
}

//function getAllComputers() {
//  return Array.from(quantumComputers.values());
//}

function setContractOwner(newOwner: string, caller: string) {
  if (caller !== contractOwner) throw new Error("Unauthorized")
  contractOwner = newOwner
  return true
}

describe("Quantum Computer Registration Contract", () => {
  beforeEach(() => {
    quantumComputers.clear()
    lastComputerId = 0
    contractOwner = "owner"
  })
  
  it("should register a new quantum computer", () => {
    const computerId = registerComputer(50, "user1")
    expect(computerId).toBe(1)
    expect(getComputer(computerId)).toEqual({ owner: "user1", qubits: 50, availability: true })
  })
  
  it("should not allow registering the same computer twice", () => {
    registerComputer(50, "user1")
    expect(() => registerComputer(50, "user1")).toThrow("Already registered")
  })
  
  it("should update computer availability", () => {
    const computerId = registerComputer(50, "user1")
    expect(updateAvailability(computerId, false, "user1")).toBe(true)
    expect(getComputer(computerId)?.availability).toBe(false)
  })
  
  it("should not allow unauthorized availability updates", () => {
    const computerId = registerComputer(50, "user1")
    expect(() => updateAvailability(computerId, false, "user2")).toThrow("Unauthorized")
  })
  
  // Note: Test for getting all computers has been removed as the corresponding function was simplified in the contract.
  
  it("should allow changing contract owner by current owner", () => {
    expect(setContractOwner("newOwner", "owner")).toBe(true)
    expect(contractOwner).toBe("newOwner")
  })
  
  it("should not allow changing contract owner by non-owner", () => {
    expect(() => setContractOwner("newOwner", "user1")).toThrow("Unauthorized")
  })
})

