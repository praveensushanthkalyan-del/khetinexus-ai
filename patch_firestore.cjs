const fs = require('fs');
let content = fs.readFileSync('src/lib/firestoreService.ts', 'utf8');

const newGetUserFarms = `export async function getUserFarms(uid: string, countryCode?: string): Promise<UserFarm[]> {
  try {
    const farmsCol = collection(db, 'users', uid, 'farms');
    const snapshot = await getDocs(farmsCol);
    const allFarms: UserFarm[] = [];
    const migrationPromises: Promise<void>[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<UserFarm, 'id'>;
      let farmCountry = data.country;
      
      // MIGRATION LOGIC
      if (!farmCountry || farmCountry === 'India') {
         farmCountry = 'IN';
         data.country = 'IN';
         migrationPromises.push(updateDoc(docSnap.ref, { country: 'IN', updatedAt: new Date().toISOString() }));
      }
      
      allFarms.push({ id: docSnap.id, ...data, country: farmCountry });
    });
    
    // Wait for migrations if any
    if (migrationPromises.length > 0) {
      await Promise.all(migrationPromises);
    }

    const filteredFarms = countryCode 
      ? allFarms.filter(f => f.country === countryCode) 
      : allFarms;

    filteredFarms.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return filteredFarms;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, \`users/\${uid}/farms\`);
    return [];
  }
}`;

content = content.replace(/export async function getUserFarms[\s\S]*?return farms;\n  \} catch \(error\) \{\n    handleFirestoreError\(error, OperationType.LIST, \`users\/\$\{uid\}\/farms\`\);\n    return \[\];\n  \}\n\}/, newGetUserFarms);

fs.writeFileSync('src/lib/firestoreService.ts', content);
