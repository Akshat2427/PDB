function normalizeContacts(rawContacts) {
    return rawContacts
      .map(c => {
        const name = c.names?.[0]?.displayName || null;
        const phone = c.phoneNumbers?.[0]?.canonicalForm || null;
        const email = c.emailAddresses?.[0]?.value || null;
  
        if (!name && !phone && !email) return null;
  
        return { name, phone, email };
      })
      .filter(Boolean);
  }

  
  export { normalizeContacts };