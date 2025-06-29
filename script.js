let fileHandle;

// 🔐 Setup DB
let db;
try {
  db = await openDB('fileDB', 1, {
    upgrade(db) {
      db.createObjectStore('handles');
    },
  });
} catch (err) {
  alert("❌ Failed to open IndexedDB:\n" + err.message);
}

// 🪄 Try loading handle on page load
try {
  fileHandle = await db.get('handles', 'autosave');

  if (fileHandle) {
    const perm = await fileHandle.queryPermission({ mode: 'readwrite' });
    if (perm !== 'granted') {
      const req = await fileHandle.requestPermission({ mode: 'readwrite' });
      if (req !== 'granted') {
        fileHandle = null;
        alert("⚠️ Permission to access the file was denied.");
      }
    }
  }
} catch (err) {
  alert("⚠️ Could not restore previous file handle:\n" + err.message);
}

// 💾 Save button
document.getElementById("save").addEventListener("click", async () => {
  try {
    const content = document.getElementById("editor").value;

    if (!fileHandle) {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: 'data.json',
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] }
        }]
      });

      await db.put('handles', fileHandle, 'autosave');
    }

    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    alert("✅ Saved to disk!");
  } catch (err) {
    alert("❌ Save failed:\n" + err.message);
  }
});

// 📂 Load button
document.getElementById("load").addEventListener("click", async () => {
  try {
    if (!fileHandle) {
      [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] }
        }]
      });
    }

    await db.put('handles', fileHandle, 'autosave');

    const file = await fileHandle.getFile();
    const contents = await file.text();
    document.getElementById("editor").value = contents;
    alert("📂 Loaded from disk!");
  } catch (err) {
    alert("❌ Load failed:\n" + err.message);
  }
});
